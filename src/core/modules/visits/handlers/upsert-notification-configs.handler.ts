import {
  INotificationConfig,
  INotificationConfigInput,
  INotificationConfigRepository,
} from "../interfaces/notification-config.interface";

export class UpsertNotificationConfigsHandler {
  private repository: INotificationConfigRepository;
  constructor(repository: INotificationConfigRepository) {
    this.repository = repository;
  }

  async execute(items: INotificationConfigInput[]): Promise<INotificationConfig[]> {
    const results: INotificationConfig[] = [];
    for (const item of items) {
      if (item.id) {
        await this.repository.update(item.id, { time: item.time });
        results.push({ id: item.id, time: item.time });
      } else {
        results.push(await this.repository.create({ time: item.time }));
      }
    }
    return results;
  }
}
