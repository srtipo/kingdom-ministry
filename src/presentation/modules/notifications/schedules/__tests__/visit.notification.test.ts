import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { VISIT_CHANNEL_ID } from "@/src/presentation/constants/notification";
import { formatDate } from "@/src/presentation/helpers/format-date";
import * as Notifications from "expo-notifications";
import { NotificationTypesEnum } from "../../types/notification-types.enum";
import {
  cancelVisitReminders,
  reScheduleVisitReminders,
  scheduleVisitNotification,
  scheduleVisitReminders,
} from "../visit.notification";

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  SchedulableTriggerInputTypes: { DATE: "date" },
}));

const mockScheduleNotificationAsync =
  Notifications.scheduleNotificationAsync as unknown as jest.Mock;
const mockCancelScheduledNotificationAsync =
  Notifications.cancelScheduledNotificationAsync as unknown as jest.Mock;
const mockGetAllScheduledNotificationsAsync =
  Notifications.getAllScheduledNotificationsAsync as unknown as jest.Mock;

describe("scheduleVisitNotification", () => {
  const FIXED_NOW = new Date("2025-06-15T10:00:00.000Z");
  const VISIT_DATE = new Date("2025-06-20T14:30:00.000Z");

  beforeEach(() => {
    mockScheduleNotificationAsync.mockReset();
    jest.useFakeTimers().setSystemTime(FIXED_NOW);
    mockScheduleNotificationAsync.mockResolvedValue("notif-id-123");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should call scheduleNotificationAsync once with the expected content for a visit", async () => {
    const id = await scheduleVisitNotification({
      visitId: "v-1",
      name: "Juan Pérez",
      type: VisitTypeEnum.visit,
      triggerDate: VISIT_DATE,
    });

    expect(id).toBe("notif-id-123");
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);

    const call = mockScheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.title).toBe("Tienes una Revisita Pendiente");
    expect(call.content.body).toBe(
      `Revisita: Juan Pérez.  Dia y hora: ${formatDate(VISIT_DATE)}`,
    );
    expect(call.content.data).toEqual({
      type: NotificationTypesEnum.VISIT,
      params: { id: "v-1" },
    });
    expect(call.trigger.date).toEqual(VISIT_DATE);
    expect(call.trigger.channelId).toBe(VISIT_CHANNEL_ID);
  });

  it("should build the title with the 'un' article for a course", async () => {
    await scheduleVisitNotification({
      visitId: "v-2",
      name: "María López",
      type: VisitTypeEnum.course,
      triggerDate: VISIT_DATE,
    });

    const call = mockScheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.title).toBe("Tienes un Curso Pendiente");
    expect(call.content.body).toBe(
      `Curso: María López.  Dia y hora: ${formatDate(VISIT_DATE)}`,
    );
  });

  it("should put the visitId under data.params.id", async () => {
    await scheduleVisitNotification({
      visitId: "abc-123",
      name: "X",
      type: VisitTypeEnum.visit,
      triggerDate: VISIT_DATE,
    });

    const data = mockScheduleNotificationAsync.mock.calls[0][0].content.data;
    expect(data.params?.id).toBe("abc-123");
  });

  it("should return null and warn in dev when scheduleNotificationAsync rejects", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockScheduleNotificationAsync.mockRejectedValueOnce(new Error("boom"));

    const result = await scheduleVisitNotification({
      visitId: "v-4",
      name: "X",
      type: VisitTypeEnum.visit,
      triggerDate: VISIT_DATE,
    });

    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe("scheduleVisitReminders", () => {
  const FIXED_NOW = new Date("2025-06-15T10:00:00.000Z");
  const VISIT_DATE = new Date("2025-06-20T14:30:00.000Z");

  beforeEach(() => {
    mockScheduleNotificationAsync.mockReset();
    jest.useFakeTimers().setSystemTime(FIXED_NOW);
    mockScheduleNotificationAsync.mockResolvedValue("notif-id");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return an empty array and not call scheduleNotificationAsync when configs is empty", async () => {
    const result = await scheduleVisitReminders({
      visitId: "v-1",
      name: "Juan",
      type: VisitTypeEnum.visit,
      nextVisit: VISIT_DATE,
      configs: [],
    });

    expect(result).toEqual([]);
    expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("should schedule one notification per config using nextVisit - time minutes", async () => {
    const configs = [{ time: 60 }, { time: 1440 }];
    mockScheduleNotificationAsync
      .mockResolvedValueOnce("id-1h")
      .mockResolvedValueOnce("id-1d");

    const result = await scheduleVisitReminders({
      visitId: "v-1",
      name: "Juan",
      type: VisitTypeEnum.visit,
      nextVisit: VISIT_DATE,
      configs,
    });

    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(2);
    expect(result).toEqual(["id-1h", "id-1d"]);

    const expected1h = new Date(VISIT_DATE.getTime() - 60 * 60_000);
    const expected1d = new Date(VISIT_DATE.getTime() - 1440 * 60_000);

    expect(mockScheduleNotificationAsync.mock.calls[0][0].trigger.date).toEqual(
      expected1h,
    );
    expect(mockScheduleNotificationAsync.mock.calls[1][0].trigger.date).toEqual(
      expected1d,
    );
    expect(
      mockScheduleNotificationAsync.mock.calls[0][0].content.data.params.id,
    ).toBe("v-1");
  });

  it("should skip configs whose trigger date is in the past and keep the rest", async () => {
    const configs = [{ time: 100_000 }, { time: 1440 }];
    mockScheduleNotificationAsync.mockResolvedValueOnce("id-1d");

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const result = await scheduleVisitReminders({
      visitId: "v-1",
      name: "Juan",
      type: VisitTypeEnum.visit,
      nextVisit: VISIT_DATE,
      configs,
    });

    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual(["id-1d"]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should record a null entry when the underlying scheduler fails and keep iterating", async () => {
    const configs = [{ time: 60 }, { time: 120 }];
    mockScheduleNotificationAsync
      .mockResolvedValueOnce("id-1h")
      .mockRejectedValueOnce(new Error("boom"));

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const result = await scheduleVisitReminders({
      visitId: "v-1",
      name: "Juan",
      type: VisitTypeEnum.visit,
      nextVisit: VISIT_DATE,
      configs,
    });

    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(2);
    expect(result).toEqual(["id-1h", null]);
    warnSpy.mockRestore();
  });

  it("should use the course article and copy visit metadata into each reminder", async () => {
    const configs = [{ time: 60 }, { time: 120 }];
    mockScheduleNotificationAsync
      .mockResolvedValueOnce("id-1")
      .mockResolvedValueOnce("id-2");

    await scheduleVisitReminders({
      visitId: "v-course",
      name: "María",
      type: VisitTypeEnum.course,
      nextVisit: VISIT_DATE,
      configs,
    });

    const titles = mockScheduleNotificationAsync.mock.calls.map(
      (call) => call[0].content.title,
    );
    const bodies = mockScheduleNotificationAsync.mock.calls.map(
      (call) => call[0].content.body,
    );
    const dataIds = mockScheduleNotificationAsync.mock.calls.map(
      (call) => call[0].content.data.params.id,
    );

    expect(titles).toEqual([
      "Tienes un Curso Pendiente",
      "Tienes un Curso Pendiente",
    ]);
    expect(bodies[0]).toContain("Curso: María");
    expect(bodies[1]).toContain("Curso: María");
    expect(dataIds).toEqual(["v-course", "v-course"]);
  });
});

describe("cancelVisitReminders", () => {
  beforeEach(() => {
    mockGetAllScheduledNotificationsAsync.mockReset();
    mockCancelScheduledNotificationAsync.mockReset();
    mockGetAllScheduledNotificationsAsync.mockResolvedValue([]);
    mockCancelScheduledNotificationAsync.mockResolvedValue(undefined);
  });

  it("should cancel only notifications matching the visitId and type VISIT", async () => {
    mockGetAllScheduledNotificationsAsync.mockResolvedValueOnce([
      {
        identifier: "n-1",
        content: {
          data: {
            type: NotificationTypesEnum.VISIT,
            params: { id: "v-1" },
          },
        },
        trigger: { type: "date" },
      },
      {
        identifier: "n-2",
        content: {
          data: {
            type: NotificationTypesEnum.VISIT,
            params: { id: "v-2" },
          },
        },
        trigger: { type: "date" },
      },
      {
        identifier: "n-3",
        content: { data: { type: "OTHER", params: { id: "v-1" } } },
        trigger: { type: "date" },
      },
      {
        identifier: "n-4",
        content: {
          data: { type: NotificationTypesEnum.VISIT, params: {} },
        },
        trigger: { type: "date" },
      },
    ]);

    const count = await cancelVisitReminders({ visitId: "v-1" });

    expect(count).toBe(1);
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledTimes(1);
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith("n-1");
  });

  it("should return 0 and not call cancel when there are no matching notifications", async () => {
    mockGetAllScheduledNotificationsAsync.mockResolvedValueOnce([
      {
        identifier: "n-1",
        content: {
          data: {
            type: NotificationTypesEnum.VISIT,
            params: { id: "v-other" },
          },
        },
        trigger: { type: "date" },
      },
    ]);

    const count = await cancelVisitReminders({ visitId: "v-1" });

    expect(count).toBe(0);
    expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalled();
  });

  it("should return 0 and warn when getAllScheduledNotificationsAsync rejects", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockGetAllScheduledNotificationsAsync.mockRejectedValueOnce(
      new Error("boom"),
    );

    const count = await cancelVisitReminders({ visitId: "v-1" });

    expect(count).toBe(0);
    expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe("reScheduleVisitReminders", () => {
  const FIXED_NOW = new Date("2025-06-15T10:00:00.000Z");
  const VISIT_DATE = new Date("2025-06-20T14:30:00.000Z");

  beforeEach(() => {
    mockScheduleNotificationAsync.mockReset();
    mockCancelScheduledNotificationAsync.mockReset();
    mockGetAllScheduledNotificationsAsync.mockReset();
    jest.useFakeTimers().setSystemTime(FIXED_NOW);
    mockScheduleNotificationAsync.mockResolvedValue("notif-id");
    mockCancelScheduledNotificationAsync.mockResolvedValue(undefined);
    mockGetAllScheduledNotificationsAsync.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should cancel existing reminders for the visitId and then schedule new ones", async () => {
    mockGetAllScheduledNotificationsAsync.mockResolvedValueOnce([
      {
        identifier: "old-1",
        content: {
          data: {
            type: NotificationTypesEnum.VISIT,
            params: { id: "v-1" },
          },
        },
        trigger: { type: "date" },
      },
      {
        identifier: "old-2",
        content: {
          data: {
            type: NotificationTypesEnum.VISIT,
            params: { id: "v-1" },
          },
        },
        trigger: { type: "date" },
      },
    ]);
    mockScheduleNotificationAsync
      .mockResolvedValueOnce("new-1")
      .mockResolvedValueOnce("new-2");

    const configs = [{ time: 60 }, { time: 120 }];
    const result = await reScheduleVisitReminders({
      visitId: "v-1",
      name: "Juan",
      type: VisitTypeEnum.visit,
      nextVisit: VISIT_DATE,
      configs,
    });

    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledTimes(2);
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith("old-1");
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith("old-2");
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(2);
    expect(result).toEqual(["new-1", "new-2"]);
  });

  it("should not cancel reminders belonging to other visits", async () => {
    mockGetAllScheduledNotificationsAsync.mockResolvedValueOnce([
      {
        identifier: "other-visit",
        content: {
          data: {
            type: NotificationTypesEnum.VISIT,
            params: { id: "v-other" },
          },
        },
        trigger: { type: "date" },
      },
    ]);

    await reScheduleVisitReminders({
      visitId: "v-1",
      name: "Juan",
      type: VisitTypeEnum.visit,
      nextVisit: VISIT_DATE,
      configs: [{ time: 60 }],
    });

    expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalled();
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
  });

  it("should still schedule new reminders when there are no existing reminders to cancel", async () => {
    mockScheduleNotificationAsync.mockResolvedValueOnce("new-1");

    const result = await reScheduleVisitReminders({
      visitId: "v-1",
      name: "Juan",
      type: VisitTypeEnum.visit,
      nextVisit: VISIT_DATE,
      configs: [{ time: 60 }],
    });

    expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalled();
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual(["new-1"]);
  });

  it("should still schedule new reminders when the cancel step throws", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockGetAllScheduledNotificationsAsync.mockRejectedValueOnce(
      new Error("boom"),
    );
    mockScheduleNotificationAsync.mockResolvedValueOnce("new-1");

    const result = await reScheduleVisitReminders({
      visitId: "v-1",
      name: "Juan",
      type: VisitTypeEnum.visit,
      nextVisit: VISIT_DATE,
      configs: [{ time: 60 }],
    });

    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual(["new-1"]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
