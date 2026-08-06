jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
  SchedulableTriggerInputTypes: { DATE: "date" },
}));

import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { VISIT_CHANNEL_ID } from "@/src/presentation/constants/notification";
import { formatDate } from "@/src/presentation/helpers/format-date";
import * as Notifications from "expo-notifications";
import { scheduleVisitNotification } from "../visit.notification";
import { NotificationTypesEnum } from "../../types/notification-types.enum";

const mockScheduleNotificationAsync =
  Notifications.scheduleNotificationAsync as unknown as jest.Mock;

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
      date: VISIT_DATE,
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
  });

  it("should build the title with the 'un' article for a course", async () => {
    await scheduleVisitNotification({
      visitId: "v-2",
      name: "María López",
      type: VisitTypeEnum.course,
      date: VISIT_DATE,
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
      date: VISIT_DATE,
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
      date: VISIT_DATE,
    });

    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
