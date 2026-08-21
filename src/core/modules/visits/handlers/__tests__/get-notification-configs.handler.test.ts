import {
  INotificationConfig,
  INotificationConfigRepository,
} from "../../interfaces/notification-config.interface";
import { GetNotificationConfigsHandler } from "../get-notification-configs.handler";

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

describe("GetNotificationConfigsHandler", () => {
  it("should return the rows produced by repository.getAll()", async () => {
    const rows: INotificationConfig[] = [
      { id: "b", time: 60 },
      { id: "a", time: 30 },
    ];
    const repo = makeRepo({
      getAll: jest.fn().mockResolvedValue(rows),
    });
    const handler = new GetNotificationConfigsHandler(repo);

    const result = await handler.execute();

    expect(repo.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(rows);
  });

  it("should return an empty array when the repository has no rows", async () => {
    const repo = makeRepo({
      getAll: jest.fn().mockResolvedValue([]),
    });
    const handler = new GetNotificationConfigsHandler(repo);

    const result = await handler.execute();

    expect(result).toEqual([]);
  });

  it("should propagate the error when the repository throws", async () => {
    const repo = makeRepo({
      getAll: jest.fn().mockRejectedValue(new Error("db down")),
    });
    const handler = new GetNotificationConfigsHandler(repo);

    await expect(handler.execute()).rejects.toThrow("db down");
  });

  it("should sort the results by time descending", async () => {
    const rows: INotificationConfig[] = [
      { id: "b", time: 10080 },
      { id: "c", time: 60 },
      { id: "a", time: 1440 },
    ];
    const repo = makeRepo({
      getAll: jest.fn().mockResolvedValue(rows),
    });
    const handler = new GetNotificationConfigsHandler(repo);

    const result = await handler.execute();

    expect(result.map((r) => r.time)).toEqual([10080, 1440, 60]);
  });
});
