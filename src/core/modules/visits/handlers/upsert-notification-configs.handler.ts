import {
  INotificationConfig,
  INotificationConfigInput,
  INotificationConfigRepository,
  INotificationConfigUpsertOptions,
} from "../interfaces/notification-config.interface";

export class UpsertNotificationConfigsHandler {
  private repository: INotificationConfigRepository;
  constructor(repository: INotificationConfigRepository) {
    this.repository = repository;
  }

  async execute(
    items: INotificationConfigInput[],
    options: INotificationConfigUpsertOptions = {},
  ): Promise<INotificationConfig[]> {
    const results: INotificationConfig[] = [];
    const itemIds = new Set(
      items.filter((item) => item.id).map((item) => item.id as string),
    );
    for (const item of items) {
      if (item.id) {
        await this.repository.update(item.id, { time: item.time });
        results.push({ id: item.id, time: item.time });
      } else {
        results.push(await this.repository.create({ time: item.time }));
      }
    }
    for (const previousId of options.previousIds ?? []) {
      if (itemIds.has(previousId)) {
        continue;
      }
      await this.repository.delete(previousId);
    }
    return results;
  }
}
