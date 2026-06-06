import { createVisitsHandler } from "@/src/di/visits/container";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IVisit } from "../type/visit.interface";

export type ICreateVisit = Omit<IVisit, "id" | "next_visit" | "last_visit"> & {
  next_visit: Date;
  last_visit: Date;
};
export default function useCreateVisit({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: createVisit, ...rest } = useMutation<
    void,
    Error,
    ICreateVisit
  >({
    mutationFn: async (visit: ICreateVisit) => {
      return await createVisitsHandler.execute(visit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
  return { createVisit, ...rest };
}
