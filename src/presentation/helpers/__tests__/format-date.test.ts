import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import { formatDate } from "../format-date";

describe("formatDate", () => {
  it("should format a date in dd MMM format with time", () => {
    const date = new Date("2024-01-15T10:30:00");
    const result = formatDate(date);
    expect(result).toMatch(/lunes.*15.*01.*10:30/);
  });

  it("should handle string date input", () => {
    const result = formatDate("2024-06-01");
    expect(result).toContain("sábado");
    expect(result).toContain("06");
  });

  it("should handle undefined gracefully", () => {
    const result = formatDate(undefined);
    expect(typeof result).toBe("string");
  });

  it("should accept a custom format string", () => {
    const result = formatDate(
      new Date("2024-01-15T10:30:00"),
      "DD [de] MMMM, YYYY",
    );
    expect(result).toBe("15 de enero, 2024");
  });
});
