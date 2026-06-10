import { getVisitDetailsHandler } from "@/src/di/visits/container";
import { useQuery } from "@tanstack/react-query";
import { IVisitDetail } from "../types/visit-detail.interface";

export function useGetVisitDetail(id: string) {
  return useQuery<IVisitDetail, Error>({
    queryKey: ["visit-detail", id],
    queryFn: async () => await getVisitDetailsHandler.execute(id),
  });
}
