import { generateUUID } from "@/src/presentation/libraries/crypto";
import { SQLiteDatabase } from "expo-sqlite";
import {
  ICreateNotificationConfig,
  INotificationConfig,
  INotificationConfigRepository,
} from "../../../../core/modules/visits/interfaces/notification-config.interface";
import {
  createNotificationConfigToSqlParams,
  NotificationConfigSqlRow,
  notificationConfigSqlRowsToDomain,
} from "../mappers/notification-config.mapper";

export class NotificationConfigRepository
  implements INotificationConfigRepository
{
  private db: SQLiteDatabase;
  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  async create(data: ICreateNotificationConfig): Promise<INotificationConfig> {
    const uuid = generateUUID();
    const params = createNotificationConfigToSqlParams(data, uuid);
    await this.db.runAsync(
      "INSERT INTO visit_notification_config (id, time) VALUES (?, ?)",
      [params.id, params.time],
    );
    return { id: uuid, time: data.time };
  }

  async getAll(): Promise<INotificationConfig[]> {
    const rows = await this.db.getAllAsync<NotificationConfigSqlRow>(
      "SELECT id, time FROM visit_notification_config",
    );
    return notificationConfigSqlRowsToDomain(rows);
  }

  async update(id: string, data: Partial<INotificationConfig>): Promise<void> {
    if (data.time === undefined) {
      return;
    }
    await this.db.runAsync(
      "UPDATE visit_notification_config SET time = ? WHERE id = ?",
      [data.time, id],
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync(
      "DELETE FROM visit_notification_config WHERE id = ?",
      [id],
    );
  }
}
