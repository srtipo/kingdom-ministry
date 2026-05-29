import { useQuery } from "@tanstack/react-query";
import { useGetVisitsHandler } from "../domain/use-get-visits-handler";
import { IVisit } from "../type/visit.interface";
export function useGetVisits(searhTerm: string | undefined) {
  const visitHandler = useGetVisitsHandler();
  return useQuery<IVisit[], Error>({
    queryKey: ["visits", searhTerm],
    queryFn: async () => await visitHandler.execute(searhTerm),
  });
}
