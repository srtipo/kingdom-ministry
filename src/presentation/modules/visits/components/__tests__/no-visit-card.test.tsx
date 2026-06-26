import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/src/presentation/hooks/use-theme-color", () => ({
  useThemeColor: () => ({
    chips: { bad: "red", warning: "orange", good: "green" },
    scrim: "#000",
    elevation: { level2: "#eee" },
  }),
}));

jest.mock("../create-visit.modal", () => {
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: () => (
      <TouchableOpacity>
        <Text>Nueva Revisita/Curso</Text>
      </TouchableOpacity>
    ),
  };
});

import { NoVisitCard } from "../no-visit-card";

describe("NoVisitCard", () => {
  it("renders empty state message", async () => {
    const { getByText } = await render(<NoVisitCard />);
    expect(getByText("No tienes revisitas para esta fecha")).toBeTruthy();
  });

  it("renders the create visit button", async () => {
    const { getByText } = await render(<NoVisitCard />);
    expect(getByText("Nueva Revisita/Curso")).toBeTruthy();
  });
});
