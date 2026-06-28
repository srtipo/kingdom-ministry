import { ICreateAttendance } from "@/src/core/modules/visits/interfaces/attendance.interface";

export interface CreateAttendanceSqlParams {
  id: string;
  visit_id: string;
  date: string;
  notes: string | null;
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
