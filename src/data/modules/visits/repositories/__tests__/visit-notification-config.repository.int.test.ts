let mockUuidCounter = 0;
jest.mock("@/src/presentation/libraries/crypto", () => ({
  generateUUID: () => {
    mockUuidCounter++;
    return `fixed-uuid-${mockUuidCounter}`;
  },
}));

import { createTestDb } from "@/src/data/database/sqlite-test-adapter";
import { NotificationConfigRepository } from "../visit-notification-config.repository";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS visit_notification_config (
    id TEXT PRIMARY KEY NOT NULL,
    time INTEGER NOT NULL
  );
`;

describe("NotificationConfigRepository integration", () => {
  async function createRepo() {
    const db = await createTestDb();
    await db.execAsync(SCHEMA);
    return { db, repository: new NotificationConfigRepository(db as any) };
  }

  beforeEach(() => {
    mockUuidCounter = 0;
  });

  describe("create", () => {
    it("should persist a notification config with the generated id", async () => {
      const { db, repository } = await createRepo();

      const result = await repository.create({ time: 60 });

      expect(result.id).toBe("fixed-uuid-1");
      expect(result.time).toBe(60);

      const rows = await db.getAllAsync<any>(
        "SELECT * FROM visit_notification_config",
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe("fixed-uuid-1");
      expect(rows[0].time).toBe(60);
    });

    it("should generate distinct ids for each insert", async () => {
      const { repository } = await createRepo();

      const a = await repository.create({ time: 30 });
      const b = await repository.create({ time: 120 });

      expect(a.id).toBe("fixed-uuid-1");
      expect(b.id).toBe("fixed-uuid-2");
    });
  });

  describe("getAll", () => {
    it("should return rows ordered by time ASC", async () => {
      const { repository } = await createRepo();
      await repository.create({ time: 1440 });
      await repository.create({ time: 60 });
      await repository.create({ time: 10080 });

      const result = await repository.getAll();

      expect(result.map((r) => r.time)).toEqual([60, 1440, 10080]);
    });

    it("should return an empty array when no rows exist", async () => {
      const { repository } = await createRepo();

      const result = await repository.getAll();

      expect(result).toEqual([]);
    });
  });

  describe("update", () => {
    it("should update the time of an existing row", async () => {
      const { db, repository } = await createRepo();
      const created = await repository.create({ time: 60 });

      await repository.update(created.id, { time: 120 });

      const rows = await db.getAllAsync<any>(
        "SELECT * FROM visit_notification_config WHERE id = ?",
        [created.id],
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].time).toBe(120);
    });

    it("should be a no-op when time is not provided", async () => {
      const { db, repository } = await createRepo();
      const created = await repository.create({ time: 60 });

      await repository.update(created.id, {});

      const rows = await db.getAllAsync<any>(
        "SELECT * FROM visit_notification_config WHERE id = ?",
        [created.id],
      );
      expect(rows[0].time).toBe(60);
    });
  });

  describe("delete", () => {
    it("should remove the row with the given id", async () => {
      const { db, repository } = await createRepo();
      const a = await repository.create({ time: 60 });
      await repository.create({ time: 120 });

      await repository.delete(a.id);

      const remaining = await db.getAllAsync<any>(
        "SELECT * FROM visit_notification_config",
      );
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe("fixed-uuid-2");
    });

    it("should be a no-op when the id does not exist", async () => {
      const { db, repository } = await createRepo();
      await repository.create({ time: 60 });

      await repository.delete("nonexistent");

      const remaining = await db.getAllAsync<any>(
        "SELECT * FROM visit_notification_config",
      );
      expect(remaining).toHaveLength(1);
    });
  });
});
