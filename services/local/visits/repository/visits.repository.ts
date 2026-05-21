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

  async create(visit: ICreateVisit) {
    const uuid = generateUUID();
    await this.db.runAsync(
      "INSERT INTO visits (id, name, address, phone, next_visit, last_visit, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        uuid,
        visit.name,
        visit.address,
        visit.phone ?? null,
        visit.nextVisit,
        visit.lastVisit ?? null,
        visit.type,
        visit.created_at,
        visit.updated_at,
      ],
    );
  }
}
