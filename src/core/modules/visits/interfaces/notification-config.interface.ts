export interface INotificationConfig {
  id: string;
  time: number;
}

export interface ICreateNotificationConfig {
  time: number;
}

export interface INotificationConfigInput {
  id?: string;
  time: number;
}

export interface INotificationConfigRepository {
  create: (data: ICreateNotificationConfig) => Promise<INotificationConfig>;
  getAll: () => Promise<INotificationConfig[]>;
  update: (id: string, data: Partial<INotificationConfig>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
