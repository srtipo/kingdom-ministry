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
  nextVisitDate: string;
}

export interface IAttendanceRepository {
  create: (attendance: ICreateAttendance) => Promise<void>;
  getByVisitId: (
    visitId: string,
    limit: number,
    offset: number,
  ) => Promise<IAttendance[]>;
}

export interface AttendancePage {
  items: IAttendance[];
  hasMore: boolean;
}
