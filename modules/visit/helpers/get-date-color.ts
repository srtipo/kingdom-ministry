import dayjs from "dayjs";

export const getDateStatusColor = (date: string | Date): string | undefined => {
  const now = dayjs();
  const targetDate = dayjs(date);

  if (now.isAfter(targetDate)) {
    return "#F8E8F0";
  }

  if (targetDate.isAfter(now.add(24, "hours"))) {
    return "#FFE0B2";
  }

  return undefined;
};
