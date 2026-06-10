import { CreateVisitsHandler } from "@/src/core/modules/visits/handlers/create-visits.handler";
import { GetVisitDetailsHandler } from "@/src/core/modules/visits/handlers/get-visit-details.handler";
import { SearchVisitsHandler } from "@/src/core/modules/visits/handlers/search-visits.handler";
import { getDatabase } from "@/src/data/database/SqliteConnection";
import { VisitsRepository } from "@/src/data/modules/visits/repositories/visits.repository";

const db = getDatabase();

const visitRepository = new VisitsRepository(db);

export const getVisitsHandler = new SearchVisitsHandler(visitRepository);

export const createVisitsHandler = new CreateVisitsHandler(visitRepository);

export const getVisitDetailsHandler = new GetVisitDetailsHandler(
  visitRepository,
);
