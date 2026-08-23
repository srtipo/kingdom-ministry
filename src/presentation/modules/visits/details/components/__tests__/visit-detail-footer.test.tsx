import { render } from "@testing-library/react-native";

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
    outlineVariant: "#ccc",
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

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  return {
    SafeAreaProvider: ({ children }: any) => <View>{children}</View>,
    SafeAreaView: ({ children }: any) => <View>{children}</View>,
    SafeAreaInsetsContext: {
      addListener: (_event: string, cb: any) => ({
        remove: () => {
          cb({ insets });
        },
      }),
      removeListener: () => {},
    },
    useSafeAreaInsets: () => insets,
    initialWindowMetrics: null,
  };
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { VisitDetailFooter } from "../visit-detail-footer";
import type { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";

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

const baseVisit: IVisit = {
  id: "test-id",
  name: "Juan",
  address: "Calle 1",
  phone: null,
  type: VisitTypeEnum.visit,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  notes: null,
  lastVisit: undefined,
  nextVisit: "2024-01-02T00:00:00.000Z",
};

describe("VisitDetailFooter", () => {
  it("renders the 'Registrar Revisita' button for a visit", async () => {
    const { getByText } = await render(
      <VisitDetailFooter visit={baseVisit} />,
      { wrapper: Wrapper },
    );
    expect(getByText("Registrar Revisita")).toBeTruthy();
  });

  it("renders the 'Registrar Curso' button for a course", async () => {
    const { getByText } = await render(
      <VisitDetailFooter visit={{ ...baseVisit, type: VisitTypeEnum.course }} />,
      { wrapper: Wrapper },
    );
    expect(getByText("Registrar Curso")).toBeTruthy();
  });
});
