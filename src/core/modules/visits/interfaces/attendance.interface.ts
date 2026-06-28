export interface IAttendance {
  id: string;
  visitId: string;
  date: string;
  notes?: string;
}

export interface ICreateAttendance {
  visitId: string;
  date: string;
  notes?: string;
}

export interface IAttendanceRepository {
  create: (attendance: ICreateAttendance) => Promise<void>;
  getByVisitId: (visitId: string) => Promise<IAttendance[]>;
}
