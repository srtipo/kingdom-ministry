import {
  AttendancePage,
  IAttendanceRepository,
} from "../interfaces/attendance.interface";

const PAGE_SIZE = 5;
const OVERFETCH = 1;

export class GetAttendanceByVisitHandler {
  private repository: IAttendanceRepository;
  constructor(repository: IAttendanceRepository) {
    this.repository = repository;
  }

  async execute(visitId: string, page: number): Promise<AttendancePage> {
    const offset = page * PAGE_SIZE;
    const rows = await this.repository.getByVisitId(
      visitId,
      PAGE_SIZE + OVERFETCH,
      offset,
    );
    const hasMore = rows.length > PAGE_SIZE;
    return { items: rows.slice(0, PAGE_SIZE), hasMore };
  }
}
