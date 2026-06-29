import { generateUUID } from "@/src/presentation/libraries/crypto";
import { SQLiteDatabase } from "expo-sqlite";
import {
  ICreateVisit,
  IVisit,
  IVisitsRepository,
} from "../../../../core/modules/visits/interfaces/visit.interface";
import {
  createVisitToSqlParams,
  visitDomainToSqlParams,
  VisitSqlRow,
  visitSqlRowsToDomain,
  visitSqlRowToDomain,
} from "../mappers/visits.mapper";

export class VisitsRepository implements IVisitsRepository {
  private db: SQLiteDatabase;
  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  async getAll() {
    const query = await this.db.getAllAsync<VisitSqlRow>(
      "SELECT * FROM visits",
    );
    return visitSqlRowsToDomain(query);
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
    const query = await this.db.getAllAsync<VisitSqlRow>(
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
    return visitSqlRowsToDomain(query);
  }

  async create(data: ICreateVisit) {
    const uuid = generateUUID();
    const visit = createVisitToSqlParams(data, uuid);
    await this.db.runAsync(
      "INSERT INTO visits (id, name, address, phone, next_visit, last_visit, type, created_at, updated_at, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        uuid,
        visit.name,
        visit.address,
        visit.phone ?? null,
        visit.next_visit,
        visit.last_visit ? visit.last_visit : null,
        visit.type,
        visit.created_at,
        visit.updated_at,
        visit.notes ?? null,
      ],
    );
  }

  async getById(id: string) {
    const query = await this.db.getFirstAsync<VisitSqlRow>(
      "SELECT id, name, address, phone, next_visit, last_visit, type, created_at, updated_at, notes FROM visits WHERE id = ?",
      [id],
    );

    return visitSqlRowToDomain(query);
  }

  async update(id: string, data: Partial<IVisit>) {
    const { created_at, updated_at, ...sqlParams } =
      visitDomainToSqlParams(data);
    const fields = Object.keys(sqlParams).map((key) => `${key} = ?`);
    const values = Object.values(sqlParams);

    fields.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await this.db.runAsync(
      `UPDATE visits SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  }
}
