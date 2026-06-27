import { getVisitDetailsHandler } from "@/src/di/visits/container";
import { useQuery } from "@tanstack/react-query";
import { IVisitModel } from "@/src/core/modules/visits/interfaces/visit-model.interface";

export function useGetVisitDetail(id: string) {
  return useQuery<IVisitModel, Error>({
    queryKey: ["visit-detail", id],
    queryFn: async () => await getVisitDetailsHandler.execute(id),
  });
}
