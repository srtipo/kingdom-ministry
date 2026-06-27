import { getVisitDetailsHandler } from "@/src/di/visits/container";
import { useQuery } from "@tanstack/react-query";
import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";

export function useGetVisitDetail(id: string) {
  return useQuery<IVisit, Error>({
    queryKey: ["visit-detail", id],
    queryFn: async () => await getVisitDetailsHandler.execute(id),
  });
}
