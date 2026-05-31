import { useQuery } from "@tanstack/react-query";
import { useGetVisitsHandler } from "../domain/use-get-visits-handler";
import { IVisit } from "../type/visit.interface";
export function useGetVisits(
  searhTerm: string | undefined,
  {
    startDate,
    endDate,
  }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  },
) {
  const visitHandler = useGetVisitsHandler();
  return useQuery<IVisit[], Error>({
    queryKey: ["visits", searhTerm, startDate, endDate],
    queryFn: async () =>
      await visitHandler.execute(searhTerm, startDate, endDate),
  });
}
