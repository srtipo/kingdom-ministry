import * as Notifications from "expo-notifications";
import { Router, useRouter } from "expo-router";
import { useEffect } from "react";
import { NotificationData } from "../types/notification-data.interface";
import { NotificationTypesEnum } from "../types/notification-types.enum";

function handleNotification(
  notification: NotificationData,
  router: Router,
): void {
  const { type, params } = notification;
  switch (type) {
    case NotificationTypesEnum.VISIT:
      router.push({
        pathname: "/visit/[id]",
        params: { id: params?.id || "" },
      });

      break;

    default:
      router.push("/(tabs)/visit");
      break;
  }
}

export function useHandlerNotificationsClicked(): void {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { type, params } = response.notification.request.content.data;
        handleNotification({ type, params } as NotificationData, router);
      },
    );
    return () => subscription.remove();
  }, [router]);
  useEffect(() => {
    async function checkInitialNotification() {
      const response = await Notifications.getLastNotificationResponse();

      if (response) {
        const { type, params } = response.notification.request.content.data;
        handleNotification({ type, params } as NotificationData, router);
      }
    }

    checkInitialNotification();
  }, []);
}
