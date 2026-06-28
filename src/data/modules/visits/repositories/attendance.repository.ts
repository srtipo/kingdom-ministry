import { generateUUID } from "@/src/presentation/libraries/crypto";
import { SQLiteDatabase } from "expo-sqlite";
import {
  IAttendanceRepository,
  ICreateAttendance,
} from "../../../../core/modules/visits/interfaces/attendance.interface";
import { createAttendanceToSqlParams } from "../mappers/attendance.mapper";

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
}
