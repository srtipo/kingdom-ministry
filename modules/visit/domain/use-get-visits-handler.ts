import { SearchVisitsHandler } from "@/services/local/visits/handlers/searh-visits.handler";
import { useMemo } from "react";
import { useVisitRepository } from "./use-visit-repository";

export function useGetVisitsHandler() {
  const repository = useVisitRepository();
  return useMemo(() => new SearchVisitsHandler(repository), [repository]);
}
