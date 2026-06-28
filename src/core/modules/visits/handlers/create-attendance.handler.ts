import {
  IAttendanceRepository,
  ICreateAttendance,
} from "../interfaces/attendance.interface";

export class CreateAttendanceHandler {
  private repository: IAttendanceRepository;
  constructor(repository: IAttendanceRepository) {
    this.repository = repository;
  }

  async execute(data: ICreateAttendance) {
    return this.repository.create(data);
  }
}
