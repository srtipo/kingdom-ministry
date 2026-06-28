import { generateUUID } from "@/src/presentation/libraries/crypto";
import { SQLiteDatabase } from "expo-sqlite";
import {
  IAttendanceRepository,
  ICreateAttendance,
} from "../../../../core/modules/visits/interfaces/attendance.interface";
import {
  AttendanceSqlRow,
  attendanceSqlRowsToDomain,
  createAttendanceToSqlParams,
} from "../mappers/attendance.mapper";

export class AttendanceRepository implements IAttendanceRepository {
  private db: SQLiteDatabase;
  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  async create(data: ICreateAttendance) {
    const uuid = generateUUID();
    const attendance = createAttendanceToSqlParams(data, uuid);
    await this.db.runAsync(
      "INSERT INTO attendance (id, visit_id, date, notes) VALUES (?, ?, ?, ?)",
      [attendance.id, attendance.visit_id, attendance.date, attendance.notes],
    );
  }

  async getByVisitId(visitId: string) {
    const rows = await this.db.getAllAsync<AttendanceSqlRow>(
      "SELECT id, visit_id, date, notes FROM attendance WHERE visit_id = ? ORDER BY date DESC",
      [visitId],
    );
    return attendanceSqlRowsToDomain(rows);
  }
}
