import {
  ICreateNotificationConfig,
  INotificationConfig,
} from "@/src/core/modules/visits/interfaces/notification-config.interface";

export interface NotificationConfigSqlRow {
  id: string;
  time: number;
}

export function notificationConfigSqlRowToDomain(
  row: NotificationConfigSqlRow | null,
): INotificationConfig | null {
  if (!row) {
    return null;
  }
  return { id: row.id, time: row.time };
}

export function notificationConfigSqlRowsToDomain(
  rows: (NotificationConfigSqlRow | null)[],
): INotificationConfig[] {
  return rows
    .map(notificationConfigSqlRowToDomain)
    .filter((row): row is INotificationConfig => row !== null);
}

export function createNotificationConfigToSqlParams(
  data: ICreateNotificationConfig,
  uuid: string,
): NotificationConfigSqlRow {
  return { id: uuid, time: data.time };
}
