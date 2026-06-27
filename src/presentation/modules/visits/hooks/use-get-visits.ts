import { getVisitsHandler } from "@/src/di/visits/container";
import { IVisitModel } from "@/src/core/modules/visits/interfaces/visit-model.interface";
import { useQuery } from "@tanstack/react-query";
export function useGetVisits(
  searchTerm: string | undefined,
  {
    startDate,
    endDate,
  }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  },
) {
  return useQuery<IVisitModel[], Error>({
    queryKey: ["visits", searchTerm, startDate, endDate],
    queryFn: async () =>
      await getVisitsHandler.execute(searchTerm, startDate, endDate),
  });
}
