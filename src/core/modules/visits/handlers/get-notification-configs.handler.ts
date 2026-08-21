import {
  INotificationConfig,
  INotificationConfigRepository,
} from "../interfaces/notification-config.interface";

export class GetNotificationConfigsHandler {
  private repository: INotificationConfigRepository;
  constructor(repository: INotificationConfigRepository) {
    this.repository = repository;
  }

  async execute(): Promise<INotificationConfig[]> {
    const rows = await this.repository.getAll();
    return rows.sort((a, b) => b.time - a.time);
  }
}
