import { useThemeColor } from "@/hooks/use-theme-color";
import dayjs from "dayjs";

export const useGetDateStatusColor = (
  date: string | Date,
): string | undefined => {
  const { chips } = useThemeColor();

  const now = dayjs();
  const targetDate = dayjs(date);

  if (now.isAfter(targetDate)) {
    return chips.bad;
  }

  if (targetDate.isBefore(now.add(24, "hours"))) {
    return chips.warning;
  }

  return chips.good;
};
