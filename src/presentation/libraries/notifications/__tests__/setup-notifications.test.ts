jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  AndroidImportance: { HIGH: 4 },
}));

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
    select: <T,>(specifics: { android?: T; ios?: T; default?: T }): T | undefined =>
      specifics.android ?? specifics.default,
  },
}));

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { VISIT_CHANNEL_ID } from "@/src/presentation/constants/notification";
import { Colors } from "@/src/presentation/constants/theme";
import { setupNotifications } from "../setup-notifications";

const mockSetNotificationHandler =
  Notifications.setNotificationHandler as unknown as jest.Mock;
const mockSetNotificationChannelAsync =
  Notifications.setNotificationChannelAsync as unknown as jest.Mock;
const mockGetPermissionsAsync =
  Notifications.getPermissionsAsync as unknown as jest.Mock;
const mockRequestPermissionsAsync =
  Notifications.requestPermissionsAsync as unknown as jest.Mock;

async function flushMicrotasks() {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
}

describe("setupNotifications", () => {
  beforeEach(() => {
    mockSetNotificationHandler.mockReset();
    mockSetNotificationChannelAsync.mockReset();
    mockGetPermissionsAsync.mockReset();
    mockRequestPermissionsAsync.mockReset();
    Platform.OS = "android";
    mockSetNotificationChannelAsync.mockResolvedValue(undefined);
  });

  it("should call setNotificationHandler with a handler that always shows banner, list, sound and no badge", async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: "granted", canAskAgain: false });

    setupNotifications();

    expect(mockSetNotificationHandler).toHaveBeenCalledTimes(1);
    const handler = mockSetNotificationHandler.mock.calls[0][0].handleNotification;
    const result = await handler();
    expect(result).toEqual({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    });
  });

  it("should create the visit channel on Android with HIGH importance and the light color from the theme", async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: "granted", canAskAgain: false });
    Platform.OS = "android";

    setupNotifications();
    await flushMicrotasks();

    expect(mockSetNotificationChannelAsync).toHaveBeenCalledTimes(1);
    expect(mockSetNotificationChannelAsync).toHaveBeenCalledWith(
      VISIT_CHANNEL_ID,
      expect.objectContaining({
        name: "Recordatorios",
        importance: 4,
        lightColor: Colors.light.primary,
        sound: "default",
      }),
    );
  });

  it("should not create a notification channel on iOS", async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: "granted", canAskAgain: false });
    Platform.OS = "ios";

    setupNotifications();
    await flushMicrotasks();

    expect(mockSetNotificationChannelAsync).not.toHaveBeenCalled();
  });

  it("should not request permissions when they are already granted", async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: "granted", canAskAgain: true });

    setupNotifications();
    await flushMicrotasks();

    expect(mockRequestPermissionsAsync).not.toHaveBeenCalled();
  });

  it("should request permissions when not granted and canAskAgain is true", async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: "undetermined", canAskAgain: true });

    setupNotifications();
    await flushMicrotasks();

    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(1);
  });

  it("should not request permissions when not granted and canAskAgain is false", async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: "denied", canAskAgain: false });

    setupNotifications();
    await flushMicrotasks();

    expect(mockRequestPermissionsAsync).not.toHaveBeenCalled();
  });

  it("should early-return when setNotificationHandler throws, skipping channel and permissions", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockSetNotificationHandler.mockImplementationOnce(() => {
      throw new Error("handler failed");
    });
    mockGetPermissionsAsync.mockResolvedValue({ status: "undetermined", canAskAgain: true });

    setupNotifications();
    await flushMicrotasks();

    expect(mockSetNotificationChannelAsync).not.toHaveBeenCalled();
    expect(mockGetPermissionsAsync).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
