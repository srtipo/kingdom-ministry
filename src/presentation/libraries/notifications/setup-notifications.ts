import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { VISIT_CHANNEL_ID } from "../../constants/notification";
import { Colors } from "../../constants/theme";

export function setupNotifications(): void {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    if (__DEV__) {
      console.warn("[notifications] setNotificationHandler failed", error);
    }
    return;
  }

  if (Platform.OS === "android") {
    void Notifications.setNotificationChannelAsync(VISIT_CHANNEL_ID, {
      name: "Recordatorios",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: Colors.light.primary,
      sound: "default",
    }).catch((error) => {
      if (__DEV__) {
        console.warn(
          "[notifications] setNotificationChannelAsync failed",
          error,
        );
      }
    });
  }

  void Notifications.getPermissionsAsync()
    .then(({ status, canAskAgain }) => {
      if (status !== "granted" && canAskAgain) {
        void Notifications.requestPermissionsAsync();
      }
    })
    .catch((error) => {
      if (__DEV__) {
        console.warn("[notifications] getPermissionsAsync failed", error);
      }
    });
}
