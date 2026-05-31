import { generateUUID } from "@/libraries/crypto";
import { SQLiteDatabase } from "expo-sqlite";
import {
  ICreateVisit,
  IVisitModel,
  IVisitsRepository,
} from "../interfaces/visit-model.interface";

export class VisitsRepository implements IVisitsRepository {
  private db: SQLiteDatabase;
  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  async getAll() {
    return this.db.getAllAsync<IVisitModel>("SELECT * FROM visits");
  }

  async getAllOrderedByNextVisit(
    term?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const startDateString = startDate ? startDate.toISOString() : null;
    const endDateString = endDate ? endDate.toISOString() : null;
    const startDateQuery = startDateString ? "AND next_visit >= ?" : "";
    const endDateQuery = endDateString ? "AND next_visit <= ?" : "";
    const searchPattern = `%${term ?? ""}%`;
    const query = this.db.getAllAsync<IVisitModel>(
      "SELECT * FROM visits WHERE (name LIKE ? OR address LIKE ?) " +
        startDateQuery +
        endDateQuery +
        " ORDER BY next_visit ASC",
      [
        searchPattern,
        searchPattern,
        ...(startDateString ? [startDateString] : []),
        ...(endDateString ? [endDateString] : []),
      ],
    );
    return query;
  }

  async create(visit: ICreateVisit) {
    const uuid = generateUUID();
    await this.db.runAsync(
      "INSERT INTO visits (id, name, address, phone, next_visit, last_visit, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        uuid,
        visit.name,
        visit.address,
        visit.phone ?? null,
        visit.next_visit.toISOString(),
        visit.last_visit ? visit.last_visit.toISOString() : null,
        visit.type,
        visit.created_at,
        visit.updated_at,
      ],
    );
  }
}
