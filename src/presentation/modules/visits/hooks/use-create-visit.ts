import {
  ICreateVisit,
  IVisit,
} from "@/src/core/modules/visits/interfaces/visit.interface";
import { createVisitsHandler } from "@/src/di/visits/container";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateVisit({
  onSuccess,
  onError,
}: {
  onSuccess?: (visit: IVisit) => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: createVisit, ...rest } = useMutation<
    IVisit,
    Error,
    Omit<ICreateVisit, "createdAt" | "updatedAt">
  >({
    mutationFn: async (
      visit: Omit<ICreateVisit, "createdAt" | "updatedAt">,
    ) => {
      return await createVisitsHandler.execute(visit);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      onSuccess?.(data);
    },
    onError: () => {
      onError?.();
    },
  });
  return { createVisit, ...rest };
}
