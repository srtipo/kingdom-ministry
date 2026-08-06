import {
  INotificationConfig,
  INotificationConfigInput,
} from "@/src/core/modules/visits/interfaces/notification-config.interface";
import { upsertNotificationConfigsHandler } from "@/src/di/visits/container";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpsertNotificationConfigs({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: INotificationConfig[]) => void;
  onError?: () => void;
} = {}) {
  const queryClient = useQueryClient();
  const { mutate: upsertNotificationConfigs, ...rest } = useMutation<
    INotificationConfig[],
    Error,
    INotificationConfigInput[]
  >({
    mutationFn: async (items) => {
      return await upsertNotificationConfigsHandler.execute(items);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notification-configs"] });
      onSuccess?.(data);
    },
    onError: () => {
      onError?.();
    },
  });
  return { upsertNotificationConfigs, ...rest };
}
