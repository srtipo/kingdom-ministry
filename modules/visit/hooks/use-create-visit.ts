import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateVisitHandler } from "../domain/use-create-visit-handler";
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
  const createVisitHandler = useCreateVisitHandler();
  const { mutate: createVisit, ...rest } = useMutation<
    void,
    Error,
    ICreateVisit
  >({
    mutationFn: async (visit: ICreateVisit) => {
      return await createVisitHandler.execute(visit);
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
