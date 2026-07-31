let mockUuidCounter = 0;
jest.mock("@/src/presentation/libraries/crypto", () => ({
  generateUUID: () => {
    mockUuidCounter++;
    return `fixed-uuid-${mockUuidCounter}`;
  },
}));

import { createTestDb } from "@/src/data/database/sqlite-test-adapter";
import { AttendanceRepository } from "../attendance.repository";
import { VisitsRepository } from "../visits.repository";
import { CreateAttendanceHandler } from "@/src/core/modules/visits/handlers/create-attendance.handler";
import { GetAttendanceByVisitHandler } from "@/src/core/modules/visits/handlers/get-attendance-by-visit.handler";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS visits (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TEXT NOT NULL,
    type TEXT NOT NULL,
    phone TEXT,
    next_visit DATETIME NOT NULL,
    last_visit DATETIME,
    notes TEXT,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY NOT NULL,
    visit_id TEXT NOT NULL,
    date DATETIME NOT NULL,
    notes TEXT
  );
`;

describe("AttendanceRepository integration", () => {
  async function createRepo() {
    const db = await createTestDb();
    await db.execAsync(SCHEMA);
    const repository = new AttendanceRepository(db as any);
    const visitRepository = new VisitsRepository(db as any);
    const createHandler = new CreateAttendanceHandler(repository, visitRepository);
    const getByVisitHandler = new GetAttendanceByVisitHandler(repository);
    return { db, repository, createHandler, getByVisitHandler };
  }

  beforeEach(() => {
    mockUuidCounter = 0;
  });

  async function seedVisit(db: any, id: string) {
    await db.runAsync(
      "INSERT INTO visits (id, name, address, created_at, type, next_visit, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, "John Doe", "123 Main St", new Date().toISOString(), "visit", new Date().toISOString(), new Date().toISOString()],
    );
  }

  describe("create", () => {
    it("should persist an attendance record", async () => {
      const { db, createHandler } = await createRepo();
      await seedVisit(db, "visit-1");

      await createHandler.execute({
        visitId: "visit-1",
        date: "2024-12-25T10:00:00.000Z",
        nextVisitDate: "2024-12-30T10:00:00.000Z",
      });

      const rows = await db.getAllAsync<any>("SELECT * FROM attendance");
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe("fixed-uuid-1");
      expect(rows[0].visit_id).toBe("visit-1");
      expect(rows[0].date).toBe("2024-12-25T10:00:00.000Z");
      expect(rows[0].notes).toBeNull();
    });

    it("should persist an attendance record with notes", async () => {
      const { db, createHandler } = await createRepo();
      await seedVisit(db, "visit-2");

      await createHandler.execute({
        visitId: "visit-2",
        date: "2024-12-26T14:00:00.000Z",
        notes: "Dejamos un tratado",
        nextVisitDate: "2024-12-30T10:00:00.000Z",
      });

      const rows = await db.getAllAsync<any>("SELECT * FROM attendance");
      expect(rows).toHaveLength(1);
      expect(rows[0].visit_id).toBe("visit-2");
      expect(rows[0].notes).toBe("Dejamos un tratado");
    });

    it("should throw when visit does not exist", async () => {
      const { createHandler } = await createRepo();

      await expect(
        createHandler.execute({
          visitId: "nonexistent",
          date: "2024-12-25T10:00:00.000Z",
          nextVisitDate: "2024-12-30T10:00:00.000Z",
        }),
      ).rejects.toThrow("Visit not found");
    });
  });

  describe("getByVisitId", () => {
    it("should return attendance records for a visit ordered by date desc", async () => {
      const { db, createHandler, getByVisitHandler } = await createRepo();
      await seedVisit(db, "visit-1");

      await createHandler.execute({ visitId: "visit-1", date: "2024-12-25T10:00:00.000Z", nextVisitDate: "2024-12-30T10:00:00.000Z" });
      await createHandler.execute({ visitId: "visit-1", date: "2024-12-30T10:00:00.000Z", nextVisitDate: "2024-12-31T10:00:00.000Z" });
      await createHandler.execute({ visitId: "visit-1", date: "2024-12-20T10:00:00.000Z", nextVisitDate: "2024-12-30T10:00:00.000Z" });

      const result = await getByVisitHandler.execute("visit-1", 0);

      expect(result.items).toHaveLength(3);
      expect(result.hasMore).toBe(false);
      expect(result.items[0].date).toBe("2024-12-30T10:00:00.000Z");
      expect(result.items[1].date).toBe("2024-12-25T10:00:00.000Z");
      expect(result.items[2].date).toBe("2024-12-20T10:00:00.000Z");
    });

    it("should return empty page when visit has no attendance", async () => {
      const { getByVisitHandler } = await createRepo();

      const result = await getByVisitHandler.execute("nonexistent", 0);

      expect(result.items).toEqual([]);
      expect(result.hasMore).toBe(false);
    });

    it("should only return records for the requested visit", async () => {
      const { db, createHandler, getByVisitHandler } = await createRepo();
      await seedVisit(db, "visit-1");
      await seedVisit(db, "visit-2");

      await createHandler.execute({ visitId: "visit-1", date: "2024-12-25T10:00:00.000Z", nextVisitDate: "2024-12-30T10:00:00.000Z" });
      await createHandler.execute({ visitId: "visit-2", date: "2024-12-26T10:00:00.000Z", nextVisitDate: "2024-12-30T10:00:00.000Z" });

      const result = await getByVisitHandler.execute("visit-1", 0);

      expect(result.items).toHaveLength(1);
      expect(result.hasMore).toBe(false);
      expect(result.items[0].visitId).toBe("visit-1");
    });
  });

  describe("pagination", () => {
    async function seedAttendances(
      createHandler: CreateAttendanceHandler,
      dates: string[],
    ) {
      for (const date of dates) {
        await createHandler.execute({
          visitId: "visit-1",
          date,
          nextVisitDate: "2024-12-30T10:00:00.000Z",
        });
      }
    }

    it("should return only the most recent 5 records on page 0 and hasMore true", async () => {
      const { db, createHandler, getByVisitHandler } = await createRepo();
      await seedVisit(db, "visit-1");
      await seedAttendances(createHandler, [
        "2024-12-01T10:00:00.000Z",
        "2024-12-02T10:00:00.000Z",
        "2024-12-03T10:00:00.000Z",
        "2024-12-04T10:00:00.000Z",
        "2024-12-05T10:00:00.000Z",
        "2024-12-06T10:00:00.000Z",
        "2024-12-07T10:00:00.000Z",
      ]);

      const result = await getByVisitHandler.execute("visit-1", 0);

      expect(result.items).toHaveLength(5);
      expect(result.hasMore).toBe(true);
      expect(result.items.map((a) => a.date)).toEqual([
        "2024-12-07T10:00:00.000Z",
        "2024-12-06T10:00:00.000Z",
        "2024-12-05T10:00:00.000Z",
        "2024-12-04T10:00:00.000Z",
        "2024-12-03T10:00:00.000Z",
      ]);
    });

    it("should return the remaining records on page 1 and hasMore false", async () => {
      const { db, createHandler, getByVisitHandler } = await createRepo();
      await seedVisit(db, "visit-1");
      await seedAttendances(createHandler, [
        "2024-12-01T10:00:00.000Z",
        "2024-12-02T10:00:00.000Z",
        "2024-12-03T10:00:00.000Z",
        "2024-12-04T10:00:00.000Z",
        "2024-12-05T10:00:00.000Z",
        "2024-12-06T10:00:00.000Z",
        "2024-12-07T10:00:00.000Z",
      ]);

      const result = await getByVisitHandler.execute("visit-1", 1);

      expect(result.items).toHaveLength(2);
      expect(result.hasMore).toBe(false);
      expect(result.items.map((a) => a.date)).toEqual([
        "2024-12-02T10:00:00.000Z",
        "2024-12-01T10:00:00.000Z",
      ]);
    });

    it("should return hasMore false when page fits exactly in 5 records", async () => {
      const { db, createHandler, getByVisitHandler } = await createRepo();
      await seedVisit(db, "visit-1");
      await seedAttendances(createHandler, [
        "2024-12-01T10:00:00.000Z",
        "2024-12-02T10:00:00.000Z",
        "2024-12-03T10:00:00.000Z",
        "2024-12-04T10:00:00.000Z",
        "2024-12-05T10:00:00.000Z",
      ]);

      const result = await getByVisitHandler.execute("visit-1", 0);

      expect(result.items).toHaveLength(5);
      expect(result.hasMore).toBe(false);
    });

    it("should return empty page and hasMore false when page is out of range", async () => {
      const { db, createHandler, getByVisitHandler } = await createRepo();
      await seedVisit(db, "visit-1");
      await seedAttendances(createHandler, [
        "2024-12-01T10:00:00.000Z",
        "2024-12-02T10:00:00.000Z",
        "2024-12-03T10:00:00.000Z",
        "2024-12-04T10:00:00.000Z",
        "2024-12-05T10:00:00.000Z",
        "2024-12-06T10:00:00.000Z",
        "2024-12-07T10:00:00.000Z",
      ]);

      const result = await getByVisitHandler.execute("visit-1", 2);

      expect(result.items).toEqual([]);
      expect(result.hasMore).toBe(false);
    });

    it("should return empty page and hasMore false when there are no records", async () => {
      const { getByVisitHandler } = await createRepo();

      const result = await getByVisitHandler.execute("nonexistent", 0);

      expect(result.items).toEqual([]);
      expect(result.hasMore).toBe(false);
    });
  });
});
