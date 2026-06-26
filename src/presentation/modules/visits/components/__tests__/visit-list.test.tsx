import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/src/presentation/hooks/use-theme-color", () => ({
  useThemeColor: () => ({
    background: "#fff",
    chips: { bad: "red", warning: "orange", good: "green" },
    scrim: "#000",
    elevation: { level2: "#eee" },
  }),
}));

jest.mock("../visit-card", () => {
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ visit }: any) => (
      <View><Text>{visit.name}</Text></View>
    ),
  };
});

jest.mock("../no-visit-card", () => {
  const { View, Text } = require("react-native");
  return {
    NoVisitCard: () => {
      return <View><Text>No tienes revisitas para esta fecha</Text></View>;
    },
  };
});

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children?: React.ReactNode }) => children ?? null,
}));

import VisitList from "../visit-list";
import { VisitTypeEnum } from "../../type/visit-type.enum";

describe("VisitList", () => {
  const visits = [
    {
      id: "1",
      name: "John Doe",
      address: "123 Main St",
      type: VisitTypeEnum.visit,
      next_visit: new Date(),
    },
    {
      id: "2",
      name: "Jane Doe",
      address: "456 Oak Ave",
      type: VisitTypeEnum.course,
      next_visit: new Date(),
    },
  ];

  it("renders visit cards", async () => {
    const { getByText } = await render(<VisitList visits={visits} />);
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("Jane Doe")).toBeTruthy();
  });

  it("renders empty state when no visits", async () => {
    const { getByText } = await render(<VisitList visits={[]} />);
    expect(getByText("No tienes revisitas para esta fecha")).toBeTruthy();
  });
});
