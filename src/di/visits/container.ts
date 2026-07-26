import { CreateAttendanceHandler } from "@/src/core/modules/visits/handlers/create-attendance.handler";
import { GetAttendanceByVisitHandler } from "@/src/core/modules/visits/handlers/get-attendance-by-visit.handler";
import { CreateVisitsHandler } from "@/src/core/modules/visits/handlers/create-visits.handler";
import { DeleteVisitHandler } from "@/src/core/modules/visits/handlers/delete-visit.handler";
import { GetVisitDetailsHandler } from "@/src/core/modules/visits/handlers/get-visit-details.handler";
import { SearchVisitsHandler } from "@/src/core/modules/visits/handlers/search-visits.handler";
import { UpdateVisitHandler } from "@/src/core/modules/visits/handlers/update-visit.handler";
import { getDatabase } from "@/src/data/database/SqliteConnection";
import { AttendanceRepository } from "@/src/data/modules/visits/repositories/attendance.repository";
import { VisitsRepository } from "@/src/data/modules/visits/repositories/visits.repository";

const db = getDatabase();

const visitRepository = new VisitsRepository(db);
const attendanceRepository = new AttendanceRepository(db);

export const getVisitsHandler = new SearchVisitsHandler(visitRepository);

export const createVisitsHandler = new CreateVisitsHandler(visitRepository);

export const updateVisitHandler = new UpdateVisitHandler(visitRepository);

export const deleteVisitHandler = new DeleteVisitHandler(visitRepository);

export const getVisitDetailsHandler = new GetVisitDetailsHandler(
  visitRepository,
);

export const createAttendanceHandler = new CreateAttendanceHandler(
  attendanceRepository,
  visitRepository,
);

export const getAttendanceByVisitHandler = new GetAttendanceByVisitHandler(
  attendanceRepository,
);
