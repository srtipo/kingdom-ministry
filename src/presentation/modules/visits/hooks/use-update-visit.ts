import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";
import { updateVisitHandler } from "@/src/di/visits/container";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateVisit({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: updateVisit, ...rest } = useMutation<
    void,
    Error,
    { id: string; data: Partial<IVisit> }
  >({
    mutationFn: async ({ id, data }) => {
      return await updateVisitHandler.execute(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["visit-detail"] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
  return { updateVisit, ...rest };
}
