import { INotificationConfig } from "@/src/core/modules/visits/interfaces/notification-config.interface";
import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { VISIT_CHANNEL_ID } from "@/src/presentation/constants/notification";
import { formatDate } from "@/src/presentation/helpers/format-date";
import * as Notifications from "expo-notifications";
import {
  visitArticlesTranslation,
  visitTypeTranslation,
} from "../../visits/constants/visit-type-translation";
import { NotificationData } from "../types/notification-data.interface";
import { NotificationTypesEnum } from "../types/notification-types.enum";

const MS_PER_MINUTE = 60_000;

export async function scheduleVisitNotification({
  visitId,
  name,
  type,
  triggerDate,
}: {
  visitId: string;
  name: string;
  type: VisitTypeEnum;
  triggerDate: Date;
}): Promise<string | null> {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Tienes ${visitArticlesTranslation[type]} ${visitTypeTranslation[type]} Pendiente`,
        body: `${visitTypeTranslation[type]}: ${name}.  Dia y hora: ${formatDate(triggerDate)}`,
        data: {
          type: NotificationTypesEnum.VISIT,
          params: {
            id: visitId,
          },
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        channelId: VISIT_CHANNEL_ID,
        date: triggerDate,
      },
    });
    return identifier;
  } catch (error) {
    if (__DEV__) {
      console.warn(
        "[notifications] scheduleVisitNotification has failed",
        error,
      );
    }
    return null;
  }
}

export async function scheduleVisitReminders({
  visitId,
  name,
  type,
  nextVisit,
  configs,
}: {
  visitId: string;
  name: string;
  type: VisitTypeEnum;
  nextVisit: Date;
  configs: Pick<INotificationConfig, "time">[];
}): Promise<(string | null)[]> {
  const nextVisitMs = nextVisit.getTime();
  const nowMs = Date.now();

  const results: (string | null)[] = [];

  for (const config of configs) {
    const triggerDate = new Date(nextVisitMs - config.time * MS_PER_MINUTE);
    if (triggerDate.getTime() <= nowMs) {
      if (__DEV__) {
        console.warn(
          `[notifications] skip reminder for visit ${visitId}: offset ${config.time}min lands in the past`,
        );
      }
      continue;
    }
    results.push(
      await scheduleVisitNotification({
        visitId,
        name,
        type,
        triggerDate,
      }),
    );
  }

  return results;
}

export async function cancelVisitReminders({
  visitId,
}: {
  visitId: string;
}): Promise<number> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const matches = scheduled.filter((n) => {
      const data = n.content.data as unknown as NotificationData | undefined;
      return (
        data?.type === NotificationTypesEnum.VISIT &&
        data?.params?.id === visitId
      );
    });
    await Promise.all(
      matches.map((n) =>
        Notifications.cancelScheduledNotificationAsync(n.identifier),
      ),
    );
    return matches.length;
  } catch (error) {
    if (__DEV__) {
      console.warn("[notifications] cancelVisitReminders has failed", error);
    }
    return 0;
  }
}

export async function reScheduleVisitReminders({
  visitId,
  name,
  type,
  nextVisit,
  configs,
}: {
  visitId: string;
  name: string;
  type: VisitTypeEnum;
  nextVisit: Date;
  configs: Pick<INotificationConfig, "time">[];
}): Promise<(string | null)[]> {
  await cancelVisitReminders({ visitId });
  return scheduleVisitReminders({ visitId, name, type, nextVisit, configs });
}
