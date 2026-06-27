import { getVisitsHandler } from "@/src/di/visits/container";
import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";
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
  return useQuery<IVisit[], Error>({
    queryKey: ["visits", searchTerm, startDate, endDate],
    queryFn: async () =>
      await getVisitsHandler.execute(searchTerm, startDate, endDate),
  });
}
