import {
  IAttendance,
  ICreateAttendance,
} from "@/src/core/modules/visits/interfaces/attendance.interface";

export interface AttendanceSqlRow {
  id: string;
  visit_id: string;
  date: string;
  notes: string | null;
}

export interface CreateAttendanceSqlParams {
  id: string;
  visit_id: string;
  date: string;
  notes: string | null;
}

export function attendanceSqlRowToDomain(
  row: AttendanceSqlRow,
): IAttendance {
  return {
    id: row.id,
    visitId: row.visit_id,
    date: row.date,
    notes: row.notes ?? undefined,
  };
}

export function attendanceSqlRowsToDomain(
  rows: AttendanceSqlRow[],
): IAttendance[] {
  return rows.map(attendanceSqlRowToDomain);
}

export function createAttendanceToSqlParams(
  attendance: ICreateAttendance,
  id: string,
): CreateAttendanceSqlParams {
  return {
    id,
    visit_id: attendance.visitId,
    date: attendance.date,
    notes: attendance.notes ?? null,
  };
}
