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
        }),
      ).rejects.toThrow("Visit not found");
    });
  });

  describe("getByVisitId", () => {
    it("should return attendance records for a visit ordered by date desc", async () => {
      const { db, createHandler, getByVisitHandler } = await createRepo();
      await seedVisit(db, "visit-1");

      await createHandler.execute({ visitId: "visit-1", date: "2024-12-25T10:00:00.000Z" });
      await createHandler.execute({ visitId: "visit-1", date: "2024-12-30T10:00:00.000Z" });
      await createHandler.execute({ visitId: "visit-1", date: "2024-12-20T10:00:00.000Z" });

      const result = await getByVisitHandler.execute("visit-1");

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe("2024-12-30T10:00:00.000Z");
      expect(result[1].date).toBe("2024-12-25T10:00:00.000Z");
      expect(result[2].date).toBe("2024-12-20T10:00:00.000Z");
    });

    it("should return empty array when visit has no attendance", async () => {
      const { getByVisitHandler } = await createRepo();

      const result = await getByVisitHandler.execute("nonexistent");

      expect(result).toEqual([]);
    });

    it("should only return records for the requested visit", async () => {
      const { db, createHandler, getByVisitHandler } = await createRepo();
      await seedVisit(db, "visit-1");
      await seedVisit(db, "visit-2");

      await createHandler.execute({ visitId: "visit-1", date: "2024-12-25T10:00:00.000Z" });
      await createHandler.execute({ visitId: "visit-2", date: "2024-12-26T10:00:00.000Z" });

      const result = await getByVisitHandler.execute("visit-1");

      expect(result).toHaveLength(1);
      expect(result[0].visitId).toBe("visit-1");
    });
  });
});
