import { getNotificationConfigsHandler } from "@/src/di/visits/container";
import { useCallback } from "react";

export function useFetchNotificationConfigs() {
  return useCallback(
    async () => await getNotificationConfigsHandler.execute(),
    [],
  );
}
