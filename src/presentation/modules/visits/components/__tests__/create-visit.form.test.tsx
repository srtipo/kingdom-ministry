import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/src/presentation/hooks/use-theme-color", () => ({
  useThemeColor: () => ({
    onSurfaceVariant: "#666",
  }),
}));

jest.mock("@/src/presentation/hooks/use-zod-validator", () => ({
  __esModule: true,
  default: () => ({
    validate: jest.fn(() => ({ success: true, data: { name: "Test" } })),
    errors: null,
    validateField: jest.fn(() => ({ valid: true })),
    clearErrors: jest.fn(),
  }),
}));

jest.mock("@/src/presentation/modules/visits/hooks/use-create-visit", () => ({
  __esModule: true,
  default: () => ({
    createVisit: jest.fn(),
    isPending: false,
  }),
}));

jest.mock("@/src/presentation/ui/input/text-input", () => ({
  __esModule: true,
  default: ({ label, onChangeText, error }: any) => {
    const { View, TextInput, Text: RNText } = require("react-native");
    return (
      <View>
        <RNText>{label}</RNText>
        <TextInput
          testID={`input-${label}`}
          onChangeText={onChangeText}
        />
        {error && <RNText>{error}</RNText>}
      </View>
    );
  },
}));

jest.mock("@/src/presentation/ui/input/date-hour-picker", () => ({
  __esModule: true,
  default: ({ label }: any) => {
    const { View, Text: RNText } = require("react-native");
    return <View><RNText>{label}</RNText></View>;
  },
}));

jest.mock("@/src/presentation/ui/buttons/ui-button", () => ({
  Button: ({ children, onPress, ...props }: any) => {
    const { TouchableOpacity, Text: RNText } = require("react-native");
    return (
      <TouchableOpacity onPress={onPress} testID="submit-button">
        <RNText>{children}</RNText>
      </TouchableOpacity>
    );
  },
}));

jest.mock("@/src/presentation/ui/buttons/segmented-button", () => ({
  SegmentedButton: ({ buttons, value, onValueChange }: any) => {
    const { View, TouchableOpacity, Text: RNText } = require("react-native");
    return (
      <View>
        {buttons.map((btn: any) => (
          <TouchableOpacity
            key={btn.value}
            onPress={() => onValueChange?.(btn.value)}
            testID={`segment-${btn.value}`}
          >
            <RNText>{btn.label}</RNText>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
}));

import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import CreateVisitForm from "../create-visit.form";

const mockShowSnackbar = { error: jest.fn(), success: jest.fn() };
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SnackBarContext.Provider value={{ showSnackbar: mockShowSnackbar }}>
      {children}
    </SnackBarContext.Provider>
  );
}

describe("CreateVisitForm", () => {
  it("renders form fields", async () => {
    const { getByText } = await render(<CreateVisitForm />, { wrapper: Wrapper });
    expect(getByText("Nombre")).toBeTruthy();
    expect(getByText("Dirección")).toBeTruthy();
    expect(getByText("Teléfono")).toBeTruthy();
    expect(getByText("Próxima visita")).toBeTruthy();
    expect(getByText("Notas")).toBeTruthy();
  });

  it("renders type selector segments", async () => {
    const { getByText } = await render(<CreateVisitForm />, { wrapper: Wrapper });
    expect(getByText("Revisita")).toBeTruthy();
    expect(getByText("Curso")).toBeTruthy();
  });

  it("renders submit button", async () => {
    const { getByText } = await render(<CreateVisitForm />, { wrapper: Wrapper });
    expect(getByText("Crear")).toBeTruthy();
  });
});
