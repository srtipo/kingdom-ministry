import dayjs from "dayjs";

jest.mock("@/src/presentation/hooks/use-theme-color", () => ({
  useThemeColor: () => ({
    chips: { bad: "red", warning: "orange", good: "green" },
  }),
}));

import { renderHook } from "@testing-library/react-native";
import { useGetDateStatusColor } from "../get-date-color";

describe("useGetDateStatusColor", () => {
  it("should return bad for past dates", async () => {
    const pastDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
    const { result } = await renderHook(() => useGetDateStatusColor(pastDate));
    expect(result.current).toBe("red");
  });

  it("should return warning for dates within 24 hours", async () => {
    const soonDate = dayjs().add(1, "hour").format("YYYY-MM-DD HH:mm:ss");
    const { result } = await renderHook(() => useGetDateStatusColor(soonDate));
    expect(result.current).toBe("orange");
  });

  it("should return good for future dates beyond 24 hours", async () => {
    const futureDate = dayjs().add(3, "day").format("YYYY-MM-DD");
    const { result } = await renderHook(() => useGetDateStatusColor(futureDate));
    expect(result.current).toBe("green");
  });
});
