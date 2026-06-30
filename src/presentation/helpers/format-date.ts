import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

export const formatDate = (
  date: Date | undefined | number | string,
  format = "dddd, DD/MM/YY, hh:mm A",
): string => {
  return dayjs(date).format(format);
};
