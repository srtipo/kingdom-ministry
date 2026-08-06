jest.mock("expo-notifications", () => ({
  addNotificationResponseReceivedListener: jest.fn(),
  getLastNotificationResponse: jest.fn(),
}));

jest.mock("expo-router", () => {
  const push = jest.fn();
  return {
    useRouter: () => ({ push }),
    __mockRouterPush: push,
  };
});

import { act, renderHook } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import { useHandlerNotificationsClicked } from "../handler-notifications-clicked";
import { NotificationTypesEnum } from "../../types/notification-types.enum";

const mockAddNotificationResponseReceivedListener =
  Notifications.addNotificationResponseReceivedListener as unknown as jest.Mock;
const mockGetLastNotificationResponse =
  Notifications.getLastNotificationResponse as unknown as jest.Mock;
const mockRouterPush = (
  jest.requireMock("expo-router") as { __mockRouterPush: jest.Mock }
).__mockRouterPush;

type Listener = (response: {
  notification: {
    request: {
      content: { data: { type: NotificationTypesEnum; params?: { id?: string } } };
    };
  };
}) => void;

function makeResponse(
  type: NotificationTypesEnum,
  params?: { id?: string },
) {
  return {
    notification: {
      request: { content: { data: { type, params } } },
    },
  };
}

async function renderHookAndFlush() {
  let result!: ReturnType<typeof renderHook>;
  await act(async () => {
    result = renderHook(() => useHandlerNotificationsClicked());
  });
  await act(async () => {
    await Promise.resolve();
  });
  return result;
}

describe("useHandlerNotificationsClicked", () => {
  beforeEach(() => {
    mockAddNotificationResponseReceivedListener.mockReset();
    mockGetLastNotificationResponse.mockReset();
    mockRouterPush.mockReset();
  });

  it("should subscribe to notification responses and remove the subscription on unmount", async () => {
    const remove = jest.fn();
    mockAddNotificationResponseReceivedListener.mockReturnValue({ remove });
    mockGetLastNotificationResponse.mockResolvedValue(null);

    const { unmount } = await renderHookAndFlush();

    expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledTimes(1);
    expect(remove).not.toHaveBeenCalled();

    await act(async () => {
      unmount();
    });

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it("should route to /visit/[id] with the visit id when a VISIT notification is received", async () => {
    let listener!: Listener;
    mockAddNotificationResponseReceivedListener.mockImplementation((cb: Listener) => {
      listener = cb;
      return { remove: jest.fn() };
    });
    mockGetLastNotificationResponse.mockResolvedValue(null);

    await renderHookAndFlush();

    await act(async () => {
      listener(makeResponse(NotificationTypesEnum.VISIT, { id: "v-42" }));
    });

    expect(mockRouterPush).toHaveBeenCalledWith({
      pathname: "/visit/[id]",
      params: { id: "v-42" },
    });
  });

  it("should route with an empty id when the VISIT notification has no params", async () => {
    let listener!: Listener;
    mockAddNotificationResponseReceivedListener.mockImplementation((cb: Listener) => {
      listener = cb;
      return { remove: jest.fn() };
    });
    mockGetLastNotificationResponse.mockResolvedValue(null);

    await renderHookAndFlush();

    await act(async () => {
      listener(makeResponse(NotificationTypesEnum.VISIT));
    });

    expect(mockRouterPush).toHaveBeenCalledWith({
      pathname: "/visit/[id]",
      params: { id: "" },
    });
  });

  it("should route to /(tabs)/visit when the notification type is unknown", async () => {
    let listener!: Listener;
    mockAddNotificationResponseReceivedListener.mockImplementation((cb: Listener) => {
      listener = cb;
      return { remove: jest.fn() };
    });
    mockGetLastNotificationResponse.mockResolvedValue(null);

    await renderHookAndFlush();

    await act(async () => {
      listener(
        makeResponse("SOMETHING_ELSE" as NotificationTypesEnum, { id: "x" }),
      );
    });

    expect(mockRouterPush).toHaveBeenCalledWith("/(tabs)/visit");
  });

  it("should route based on the cold-start notification returned by getLastNotificationResponse", async () => {
    mockAddNotificationResponseReceivedListener.mockReturnValue({
      remove: jest.fn(),
    });
    mockGetLastNotificationResponse.mockResolvedValue(
      makeResponse(NotificationTypesEnum.VISIT, { id: "cold-1" }),
    );

    await renderHookAndFlush();

    expect(mockRouterPush).toHaveBeenCalledWith({
      pathname: "/visit/[id]",
      params: { id: "cold-1" },
    });
  });

  it("should not push to the router when there is no cold-start notification", async () => {
    mockAddNotificationResponseReceivedListener.mockReturnValue({
      remove: jest.fn(),
    });
    mockGetLastNotificationResponse.mockResolvedValue(null);

    await renderHookAndFlush();

    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});
