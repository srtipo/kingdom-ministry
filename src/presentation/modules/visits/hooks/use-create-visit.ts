import { createVisitsHandler } from "@/src/di/visits/container";
import { ICreateVisit } from "@/src/core/modules/visits/interfaces/visit-model.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    Omit<ICreateVisit, "created_at" | "updated_at">
  >({
    mutationFn: async (
      visit: Omit<ICreateVisit, "created_at" | "updated_at">,
    ) => {
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
