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
    return this.repository.getAll();
  }
}
