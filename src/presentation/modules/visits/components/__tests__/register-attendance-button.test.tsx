import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/src/presentation/ui/buttons/ui-button", () => ({
  Button: ({ children, ...props }: any) => {
    const { TouchableOpacity, Text } = require("react-native");
    return (
      <TouchableOpacity {...props}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock("@/src/di/visits/container", () => ({
  createAttendanceHandler: { execute: jest.fn() },
}));

jest.mock("@/src/presentation/hooks/use-theme-color", () => ({
  useThemeColor: () => ({
    primary: "#000",
    surface: "#fff",
    background: "#fff",
    onSurface: "#000",
    elevation: { level2: "#eee" },
    chips: { bad: "red", warning: "orange", good: "green" },
    scrim: "#000",
    visitType: {
      visit: "#FFD700",
      onVisit: "#FFF",
      course: "#4CAF50",
      onCourse: "#FFF",
    },
  }),
}));

jest.mock("@/src/presentation/ui/modal/modal", () => ({
  Modal: ({ children }: any) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { RegisterAttendanceButton } from "../../attendances/components/register-attendance-button";

const queryClient = new QueryClient();
const mockShowSnackbar = { error: jest.fn(), success: jest.fn() };
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackBarContext.Provider value={{ showSnackbar: mockShowSnackbar }}>
        {children}
      </SnackBarContext.Provider>
    </QueryClientProvider>
  );
}

describe("RegisterAttendanceButton", () => {
  it("renders with visit text by default", async () => {
    const { getByText } = await render(
      <RegisterAttendanceButton visitId="test-id" />,
      { wrapper: Wrapper },
    );
    expect(getByText("Registrar Revisita")).toBeTruthy();
  });

  it("renders with course text for course type", async () => {
    const { getByText } = await render(
      <RegisterAttendanceButton type={VisitTypeEnum.course} visitId="test-id" />,
      { wrapper: Wrapper },
    );
    expect(getByText("Registrar Curso")).toBeTruthy();
  });

  it("renders with visit text for visit type", async () => {
    const { getByText } = await render(
      <RegisterAttendanceButton type={VisitTypeEnum.visit} visitId="test-id" />,
      { wrapper: Wrapper },
    );
    expect(getByText("Registrar Revisita")).toBeTruthy();
  });
});
