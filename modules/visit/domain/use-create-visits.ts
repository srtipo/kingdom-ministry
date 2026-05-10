import { CreateVisitsHandler } from "@/services/local/visits/handlers/create-visits.handler";
import { useMemo } from "react";
import { useVisitRepository } from "./use-visit-repository";

export function useCreateVisits() {
  const repository = useVisitRepository();
  return useMemo(() => new CreateVisitsHandler(repository), [repository]);
}
