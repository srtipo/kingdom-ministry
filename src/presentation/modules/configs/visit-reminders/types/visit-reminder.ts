export type TimeUnit = "minutes" | "hours" | "days";

export interface VisitReminder {
  id?: string;
  value: number;
  unit: TimeUnit;
}
