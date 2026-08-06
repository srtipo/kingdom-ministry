import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { VISIT_CHANNEL_ID } from "@/src/presentation/constants/notification";
import { formatDate } from "@/src/presentation/helpers/format-date";
import dayjs from "dayjs";
import * as Notifications from "expo-notifications";
import {
  visitArticlesTranslation,
  visitTypeTranslation,
} from "../../visits/constants/visit-type-translation";
import { NotificationTypesEnum } from "../types/notification-types.enum";

export async function scheduleVisitNotification({
  visitId,
  name,
  type,
  date,
}: {
  visitId: string;
  name: string;
  type: VisitTypeEnum;
  date: Date;
}): Promise<string | null> {
  const now = new Date();
  const notificationDate = dayjs(now).add(3, "second").toDate();

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Tienes ${visitArticlesTranslation[type]} ${visitTypeTranslation[type]} Pendiente`,
        body: `${visitTypeTranslation[type]}: ${name}.  Dia y hora: ${formatDate(date)}`,
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
        date: notificationDate,
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
