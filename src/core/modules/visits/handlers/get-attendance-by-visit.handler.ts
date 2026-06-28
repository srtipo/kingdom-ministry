import {
  IAttendanceRepository,
} from "../interfaces/attendance.interface";

export class GetAttendanceByVisitHandler {
  private repository: IAttendanceRepository;
  constructor(repository: IAttendanceRepository) {
    this.repository = repository;
  }

  async execute(visitId: string) {
    return this.repository.getByVisitId(visitId);
  }
}
