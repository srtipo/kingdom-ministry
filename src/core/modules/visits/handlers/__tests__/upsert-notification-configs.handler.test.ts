import {
  ICreateNotificationConfig,
  INotificationConfig,
  INotificationConfigInput,
  INotificationConfigRepository,
} from "../../interfaces/notification-config.interface";
import { UpsertNotificationConfigsHandler } from "../upsert-notification-configs.handler";

function makeRepo(
  overrides: Partial<INotificationConfigRepository> = {},
): jest.Mocked<INotificationConfigRepository> {
  return {
    create: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  } as jest.Mocked<INotificationConfigRepository>;
}

describe("UpsertNotificationConfigsHandler", () => {
  it("should return an empty array and not touch the repository when the input is empty", async () => {
    const repo = makeRepo();
    const handler = new UpsertNotificationConfigsHandler(repo);

    const result = await handler.execute([]);

    expect(result).toEqual([]);
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("should update every item when all of them have an id and not call create", async () => {
    const repo = makeRepo();
    const handler = new UpsertNotificationConfigsHandler(repo);
    const items: INotificationConfigInput[] = [
      { id: "a", time: 30 },
      { id: "b", time: 60 },
    ];

    const result = await handler.execute(items);

    expect(repo.update).toHaveBeenCalledTimes(2);
    expect(repo.update).toHaveBeenNthCalledWith(1, "a", { time: 30 });
    expect(repo.update).toHaveBeenNthCalledWith(2, "b", { time: 60 });
    expect(repo.create).not.toHaveBeenCalled();
    expect(result).toEqual([
      { id: "a", time: 30 },
      { id: "b", time: 60 },
    ]);
  });

  it("should create every item when none of them have an id and not call update", async () => {
    const repo = makeRepo({
      create: jest
        .fn<Promise<INotificationConfig>, [ICreateNotificationConfig]>()
        .mockResolvedValueOnce({ id: "gen-1", time: 30 })
        .mockResolvedValueOnce({ id: "gen-2", time: 60 }),
    });
    const handler = new UpsertNotificationConfigsHandler(repo);
    const items: INotificationConfigInput[] = [{ time: 30 }, { time: 60 }];

    const result = await handler.execute(items);

    expect(repo.create).toHaveBeenCalledTimes(2);
    expect(repo.create).toHaveBeenNthCalledWith(1, { time: 30 });
    expect(repo.create).toHaveBeenNthCalledWith(2, { time: 60 });
    expect(repo.update).not.toHaveBeenCalled();
    expect(result).toEqual([
      { id: "gen-1", time: 30 },
      { id: "gen-2", time: 60 },
    ]);
  });

  it("should branch per item and preserve the input order in the result", async () => {
    const repo = makeRepo({
      create: jest
        .fn<Promise<INotificationConfig>, [ICreateNotificationConfig]>()
        .mockResolvedValueOnce({ id: "gen-1", time: 1440 }),
    });
    const handler = new UpsertNotificationConfigsHandler(repo);
    const items: INotificationConfigInput[] = [
      { id: "existing-1", time: 60 },
      { time: 1440 },
      { id: "existing-2", time: 10080 },
    ];

    const result = await handler.execute(items);

    expect(repo.update).toHaveBeenCalledTimes(2);
    expect(repo.update).toHaveBeenNthCalledWith(1, "existing-1", { time: 60 });
    expect(repo.update).toHaveBeenNthCalledWith(2, "existing-2", {
      time: 10080,
    });
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith({ time: 1440 });
    expect(result).toEqual([
      { id: "existing-1", time: 60 },
      { id: "gen-1", time: 1440 },
      { id: "existing-2", time: 10080 },
    ]);
  });

  it("should propagate the error when the repository throws on update", async () => {
    const repo = makeRepo({
      update: jest.fn().mockRejectedValue(new Error("db down")),
    });
    const handler = new UpsertNotificationConfigsHandler(repo);

    await expect(
      handler.execute([{ id: "a", time: 30 }]),
    ).rejects.toThrow("db down");
  });

  it("should propagate the error when the repository throws on create", async () => {
    const repo = makeRepo({
      create: jest.fn().mockRejectedValue(new Error("db down")),
    });
    const handler = new UpsertNotificationConfigsHandler(repo);

    await expect(handler.execute([{ time: 30 }])).rejects.toThrow("db down");
  });

  it("should stop iterating when the repository throws mid-array", async () => {
    const repo = makeRepo({
      create: jest
        .fn<Promise<INotificationConfig>, [ICreateNotificationConfig]>()
        .mockResolvedValueOnce({ id: "gen-1", time: 30 })
        .mockRejectedValueOnce(new Error("second fails")),
    });
    const handler = new UpsertNotificationConfigsHandler(repo);

    await expect(
      handler.execute([{ time: 30 }, { time: 60 }, { time: 90 }]),
    ).rejects.toThrow("second fails");

    expect(repo.create).toHaveBeenCalledTimes(2);
    expect(repo.create).toHaveBeenNthCalledWith(1, { time: 30 });
    expect(repo.create).toHaveBeenNthCalledWith(2, { time: 60 });
  });

  it("should delete the ids in previousIds that are not present in items", async () => {
    const repo = makeRepo();
    const handler = new UpsertNotificationConfigsHandler(repo);
    const items: INotificationConfigInput[] = [
      { id: "keep-1", time: 60 },
      { time: 1440 },
    ];

    await handler.execute(items, { previousIds: ["keep-1", "drop-1", "drop-2"] });

    expect(repo.update).toHaveBeenCalledTimes(1);
    expect(repo.update).toHaveBeenCalledWith("keep-1", { time: 60 });
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith({ time: 1440 });
    expect(repo.delete).toHaveBeenCalledTimes(2);
    expect(repo.delete).toHaveBeenCalledWith("drop-1");
    expect(repo.delete).toHaveBeenCalledWith("drop-2");
  });

  it("should not delete any id when previousIds is omitted", async () => {
    const repo = makeRepo();
    const handler = new UpsertNotificationConfigsHandler(repo);

    await handler.execute([{ id: "a", time: 30 }]);

    expect(repo.delete).not.toHaveBeenCalled();
  });

  it("should skip the delete when a previousId is also present in items", async () => {
    const repo = makeRepo();
    const handler = new UpsertNotificationConfigsHandler(repo);

    await handler.execute(
      [{ id: "shared", time: 60 }],
      { previousIds: ["shared"] },
    );

    expect(repo.update).toHaveBeenCalledTimes(1);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it("should propagate the error when the repository throws on delete", async () => {
    const repo = makeRepo({
      delete: jest.fn().mockRejectedValue(new Error("db down")),
    });
    const handler = new UpsertNotificationConfigsHandler(repo);

    await expect(
      handler.execute([], { previousIds: ["drop-1"] }),
    ).rejects.toThrow("db down");
  });
});
