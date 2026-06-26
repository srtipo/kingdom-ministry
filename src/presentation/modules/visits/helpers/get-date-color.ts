import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import dayjs from "dayjs";

export enum DateStatus {
  bad = "bad",
  warning = "warning",
  good = "good",
}

export function getDateStatus(date: string | Date): DateStatus {
  const now = dayjs();
  const targetDate = dayjs(date);

  if (now.isAfter(targetDate)) {
    return DateStatus.bad;
  }

  if (targetDate.isBefore(now.add(24, "hours"))) {
    return DateStatus.warning;
  }

  return DateStatus.good;
}

export const useGetDateStatusColor = (date: string | Date): string => {
  const { chips } = useThemeColor();
  const status = getDateStatus(date);

  if (status === DateStatus.bad) {
    return chips.bad;
  }

  if (status === DateStatus.warning) {
    return chips.warning;
  }

  return chips.good;
};
