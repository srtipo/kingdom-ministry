import { INotificationConfig } from "@/src/core/modules/visits/interfaces/notification-config.interface";
import { getNotificationConfigsHandler } from "@/src/di/visits/container";
import { useQuery } from "@tanstack/react-query";

export function useGetNotificationConfigs() {
  return useQuery<INotificationConfig[], Error>({
    queryKey: ["notification-configs"],
    queryFn: async () => await getNotificationConfigsHandler.execute(),
  });
}
