import dayjs from "dayjs";

export const getDateStatusColor = (date: string | Date): string | undefined => {
  const now = dayjs();
  const targetDate = dayjs(date);

  if (now.isAfter(targetDate)) {
    return "#ffbda9";
  }

  if (targetDate.isBefore(now.add(24, "hours"))) {
    return "#f3ffb2";
  }

  return "#b2e7ff";
};
