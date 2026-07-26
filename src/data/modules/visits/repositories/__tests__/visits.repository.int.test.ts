let mockUuidCounter = 0;
jest.mock("@/src/presentation/libraries/crypto", () => ({
  generateUUID: () => {
    mockUuidCounter++;
    return `fixed-uuid-${mockUuidCounter}`;
  },
}));

import { createTestDb } from "@/src/data/database/sqlite-test-adapter";
import { VisitsRepository } from "../visits.repository";
import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { CreateVisitsHandler } from "@/src/core/modules/visits/handlers/create-visits.handler";
import { DeleteVisitHandler } from "@/src/core/modules/visits/handlers/delete-visit.handler";
import { GetVisitDetailsHandler } from "@/src/core/modules/visits/handlers/get-visit-details.handler";
import { SearchVisitsHandler } from "@/src/core/modules/visits/handlers/search-visits.handler";

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
    notes TEXT,
    FOREIGN KEY (visit_id) REFERENCES visits(id)
  );
`;

describe("VisitsRepository integration", () => {
  async function createRepo() {
    const db = await createTestDb();
    await db.execAsync(SCHEMA);
    const repository = new VisitsRepository(db as any);
    const createHandler = new CreateVisitsHandler(repository);
    const getDetailsHandler = new GetVisitDetailsHandler(repository);
    const searchHandler = new SearchVisitsHandler(repository);
    const deleteHandler = new DeleteVisitHandler(repository);
    return {
      db,
      repository,
      createHandler,
      getDetailsHandler,
      searchHandler,
      deleteHandler,
    };
  }

  beforeEach(() => {
    mockUuidCounter = 0;
  });

  describe("create", () => {
    it("should persist a visit and retrieve it", async () => {
      const { db, createHandler } = await createRepo();

      await createHandler.execute({
        name: "John Doe",
        address: "123 Main St",
        phone: "555-0100",
        nextVisit: new Date("2024-12-25T10:00:00"),
        type: VisitTypeEnum.visit,
      });

      const rows = await db.getAllAsync<any>("SELECT * FROM visits");
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe("John Doe");
      expect(rows[0].address).toBe("123 Main St");
      expect(rows[0].phone).toBe("555-0100");
      expect(rows[0].type).toBe("visit");
      expect(rows[0].created_at).toBeDefined();
      expect(rows[0].updated_at).toBeDefined();
    });

    it("should persist a visit without optional fields", async () => {
      const { db, createHandler } = await createRepo();

      await createHandler.execute({
        name: "Jane Doe",
        address: "456 Oak Ave",
        nextVisit: new Date("2024-12-30T14:00:00"),
        type: VisitTypeEnum.course,
      });

      const rows = await db.getAllAsync<any>("SELECT * FROM visits");
      expect(rows).toHaveLength(1);
      expect(rows[0].phone).toBeNull();
      expect(rows[0].notes).toBeNull();
    });
  });

  describe("getAllOrderedByNextVisit", () => {
    async function seed(createHandler: CreateVisitsHandler) {
      const visits = [
        { name: "Alice", address: "Addr A", type: VisitTypeEnum.visit, nextVisit: new Date("2024-12-20T10:00:00") },
        { name: "Bob", address: "Addr B", type: VisitTypeEnum.course, nextVisit: new Date("2024-12-25T10:00:00") },
        { name: "Charlie", address: "Addr C", type: VisitTypeEnum.visit, nextVisit: new Date("2024-12-30T10:00:00") },
      ];
      for (const v of visits) {
        await createHandler.execute(v);
      }
    }

    it("should return all visits ordered by nextVisit when no filters", async () => {
      const { createHandler, searchHandler } = await createRepo();
      await seed(createHandler);

      const result = await searchHandler.execute();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Alice");
      expect(result[1].name).toBe("Bob");
      expect(result[2].name).toBe("Charlie");
    });

    it("should filter by search term", async () => {
      const { createHandler, searchHandler } = await createRepo();
      await seed(createHandler);

      const result = await searchHandler.execute("Bob");

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bob");
    });

    it("should filter by date range", async () => {
      const { createHandler, searchHandler } = await createRepo();
      await seed(createHandler);

      const start = new Date("2024-12-24T00:00:00.000Z");
      const end = new Date("2024-12-26T23:59:59.999Z");
      const result = await searchHandler.execute(undefined, start, end);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bob");
    });
  });

  describe("getById", () => {
    it("should return visit details when found", async () => {
      const { createHandler, getDetailsHandler } = await createRepo();

      await createHandler.execute({
        name: "John Doe",
        address: "123 Main St",
        phone: "555-0100",
        nextVisit: new Date("2024-12-25T10:00:00"),
        type: VisitTypeEnum.visit,
      });

      const result = await getDetailsHandler.execute("fixed-uuid-1");
      expect(result.name).toBe("John Doe");
      expect(result.address).toBe("123 Main St");
    });

    it("should throw when not found", async () => {
      const { getDetailsHandler } = await createRepo();

      await expect(getDetailsHandler.execute("nonexistent")).rejects.toThrow("Visit not found");
    });
  });

  describe("delete", () => {
    async function seedAttendance(db: any, visitId: string) {
      await db.runAsync(
        "INSERT INTO attendance (id, visit_id, date, notes) VALUES (?, ?, ?, ?)",
        [`att-${visitId}-1`, visitId, "2024-12-20T10:00:00.000Z", "note 1"],
      );
      await db.runAsync(
        "INSERT INTO attendance (id, visit_id, date, notes) VALUES (?, ?, ?, ?)",
        [`att-${visitId}-2`, visitId, "2024-12-22T10:00:00.000Z", "note 2"],
      );
    }

    it("should delete a visit and cascade-delete its attendance records", async () => {
      const { db, createHandler, deleteHandler } = await createRepo();

      await createHandler.execute({
        name: "John Doe",
        address: "123 Main St",
        nextVisit: new Date("2024-12-25T10:00:00"),
        type: VisitTypeEnum.visit,
      });
      await seedAttendance(db, "fixed-uuid-1");

      const visitBefore = await db.getAllAsync<any>(
        "SELECT * FROM visits WHERE id = ?",
        ["fixed-uuid-1"],
      );
      const attBefore = await db.getAllAsync<any>(
        "SELECT * FROM attendance WHERE visit_id = ?",
        ["fixed-uuid-1"],
      );
      expect(visitBefore).toHaveLength(1);
      expect(attBefore).toHaveLength(2);

      await deleteHandler.execute("fixed-uuid-1");

      const visitAfter = await db.getAllAsync<any>(
        "SELECT * FROM visits WHERE id = ?",
        ["fixed-uuid-1"],
      );
      const attAfter = await db.getAllAsync<any>(
        "SELECT * FROM attendance WHERE visit_id = ?",
        ["fixed-uuid-1"],
      );
      expect(visitAfter).toHaveLength(0);
      expect(attAfter).toHaveLength(0);
    });

    it("should not affect unrelated visits or attendance", async () => {
      const { db, createHandler, deleteHandler } = await createRepo();

      await createHandler.execute({
        name: "Alice",
        address: "Addr A",
        nextVisit: new Date("2024-12-20T10:00:00"),
        type: VisitTypeEnum.visit,
      });
      await createHandler.execute({
        name: "Bob",
        address: "Addr B",
        nextVisit: new Date("2024-12-25T10:00:00"),
        type: VisitTypeEnum.visit,
      });
      await seedAttendance(db, "fixed-uuid-1");
      await seedAttendance(db, "fixed-uuid-2");

      await deleteHandler.execute("fixed-uuid-1");

      const visits = await db.getAllAsync<any>("SELECT * FROM visits");
      const att = await db.getAllAsync<any>("SELECT * FROM attendance");
      expect(visits).toHaveLength(1);
      expect(visits[0].name).toBe("Bob");
      expect(att).toHaveLength(2);
      expect(att.every((a: any) => a.visit_id === "fixed-uuid-2")).toBe(true);
    });

    it("should throw 'Visit not found' when the id does not exist", async () => {
      const { deleteHandler } = await createRepo();

      await expect(deleteHandler.execute("nonexistent")).rejects.toThrow(
        "Visit not found",
      );
    });
  });
});
