import { TimeUnit } from "../types/visit-reminder";

export interface QuickPreset {
  id: string;
  label: string;
  value: number;
  unit: TimeUnit;
}

export const QUICK_PRESETS: QuickPreset[] = [
  { id: "15m", label: "15 min", value: 15, unit: "minutes" },
  { id: "1h", label: "1 hora", value: 1, unit: "hours" },
  { id: "1d", label: "1 día", value: 1, unit: "days" },
  { id: "2d", label: "2 días", value: 2, unit: "days" },
];