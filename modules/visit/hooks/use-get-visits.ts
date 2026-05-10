import { useQuery } from "@tanstack/react-query";
import { useGetVisitsHandler } from "../domain/use-get-visits-handler";
export function useGetVisits() {
  const visitHandler = useGetVisitsHandler();
  return useQuery({
    queryKey: ["visits"],
    queryFn: async () => await visitHandler.execute("dfgdfg"),
  });
}
