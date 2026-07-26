import { deleteVisitHandler } from "@/src/di/visits/container";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteVisit({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: deleteVisit, ...rest } = useMutation<
    void,
    Error,
    { id: string }
  >({
    mutationFn: async ({ id }) => {
      return await deleteVisitHandler.execute(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["visit-detail"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-history"] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
  return { deleteVisit, ...rest };
}
