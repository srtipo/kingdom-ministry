import { getVisitsHandler } from "@/src/di/visits/container";
import { useQuery } from "@tanstack/react-query";
import { IVisit } from "../type/visit.interface";
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
