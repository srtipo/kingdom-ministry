import {
  IAttendanceRepository,
  ICreateAttendance,
} from "../interfaces/attendance.interface";
import { IVisitsRepository } from "../interfaces/visit.interface";

export class CreateAttendanceHandler {
  private attendanceRepository: IAttendanceRepository;
  private visitRepository: IVisitsRepository;
  constructor(
    attendanceRepository: IAttendanceRepository,
    visitRepository: IVisitsRepository,
  ) {
    this.attendanceRepository = attendanceRepository;
    this.visitRepository = visitRepository;
  }

  async execute(data: ICreateAttendance) {
    const visit = await this.visitRepository.getById(data.visitId);
    if (!visit) {
      throw new Error("Visit not found");
    }
    return this.attendanceRepository.create(data);
  }
}
