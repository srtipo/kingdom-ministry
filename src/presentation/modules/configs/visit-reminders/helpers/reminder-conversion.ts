import { TimeUnit, VisitReminder } from "../types/visit-reminder";

export const UNIT_TO_MINUTES: Record<TimeUnit, number> = {
  minutes: 1,
  hours: 60,
  days: 1440,
};

export const TIME_UNIT_OPTIONS: { value: TimeUnit; label: string }[] = [
  { value: "minutes", label: "minutos antes" },
  { value: "hours", label: "horas antes" },
  { value: "days", label: "días antes" },
];

export function converReminderToMinutes(
  reminder: Pick<VisitReminder, "value" | "unit">,
): number {
  return reminder.value * UNIT_TO_MINUTES[reminder.unit];
}

export function converReminderfromMinutes(minutes: number): {
  value: number;
  unit: TimeUnit;
} {
  if (minutes <= 0) {
    return { value: 1, unit: "minutes" };
  }
  if (minutes % 1440 === 0) {
    return { value: minutes / 1440, unit: "days" };
  }
  if (minutes % 60 === 0) {
    return { value: minutes / 60, unit: "hours" };
  }
  return { value: minutes, unit: "minutes" };
}

export function compareByMinutes(
  a: Pick<VisitReminder, "value" | "unit">,
  b: Pick<VisitReminder, "value" | "unit">,
): boolean {
  return converReminderToMinutes(a) === converReminderToMinutes(b);
}

export function isMinutesInList(
  minutes: number,
  list: Pick<VisitReminder, "value" | "unit">[],
): boolean {
  return list.some((r) => converReminderToMinutes(r) === minutes);
}

export function formatReminder(
  reminder: Pick<VisitReminder, "value" | "unit">,
): string {
  const { value, unit } = reminder;
  if (unit === "minutes") {
    return value === 1 ? "1 minuto antes" : `${value} minutos antes`;
  }
  if (unit === "hours") {
    return value === 1 ? "1 hora antes" : `${value} horas antes`;
  }
  return value === 1 ? "1 día antes" : `${value} días antes`;
}
