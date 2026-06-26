import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

jest.mock("@/src/presentation/hooks/use-theme-color", () => ({
  useThemeColor: () => ({
    background: "#fff",
  }),
}));

jest.mock("@/src/presentation/ui/input/date-picker", () => ({
  DatePicker: () => null,
}));

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children?: React.ReactNode }) => children ?? null,
}));

import { VisitDateSelection, DateSelectionEnum } from "../visit-date-selection";

describe("VisitDateSelection", () => {
  it("renders segmented buttons", async () => {
    const { getByText } = await render(<VisitDateSelection />);
    expect(getByText("Hoy")).toBeTruthy();
    expect(getByText("Mañana")).toBeTruthy();
    expect(getByText("Todos")).toBeTruthy();
  });

  it("calls onChange with Today dates when Hoy is selected", async () => {
    const onChange = jest.fn();
    const { getByText } = await render(
      <VisitDateSelection onChange={onChange} />,
    );

    fireEvent.press(getByText("Hoy"));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: DateSelectionEnum.Today }),
    );
  });

  it("calls onChange with Tomorrow dates when Mañana is selected", async () => {
    const onChange = jest.fn();
    const { getByText } = await render(
      <VisitDateSelection onChange={onChange} />,
    );

    fireEvent.press(getByText("Mañana"));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: DateSelectionEnum.Tomorrow }),
    );
  });

  it("calls onChange with All when Todos is selected", async () => {
    const onChange = jest.fn();
    const { getByText } = await render(
      <VisitDateSelection onChange={onChange} />,
    );

    fireEvent.press(getByText("Todos"));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: undefined,
        endDate: undefined,
        value: DateSelectionEnum.All,
      }),
    );
  });
});
