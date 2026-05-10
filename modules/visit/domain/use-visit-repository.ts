import { useDb } from "@/database/use-db";
import { VisitsRepository } from "@/services/local/visits/repository/visits.repository";
import { useMemo } from "react";

export function useVisitRepository() {
  const db = useDb();
  return useMemo(() => new VisitsRepository(db), [db]);
}
