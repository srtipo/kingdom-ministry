import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/src/presentation/hooks/use-theme-color", () => ({
  useThemeColor: () => ({
    onSurfaceVariant: "#666",
  }),
}));

jest.mock("@/src/presentation/hooks/use-zod-validator", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/src/presentation/modules/visits/hooks/use-create-visit", () => ({
  __esModule: true,
  default: jest.fn(),
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
  Button: ({ children, onPress, isloanding, ...props }: any) => {
    const { TouchableOpacity, Text: RNText } = require("react-native");
    return (
      <TouchableOpacity
        onPress={isloanding ? undefined : onPress}
        disabled={isloanding}
        testID="submit-button"
      >
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
import useZodValidator from "@/src/presentation/hooks/use-zod-validator";
import useCreateVisit from "@/src/presentation/modules/visits/hooks/use-create-visit";
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
  beforeEach(() => {
    (useZodValidator as jest.Mock).mockReturnValue({
      validate: jest.fn(() => ({ success: true, data: { name: "Test" } })),
      errors: null,
      validateField: jest.fn(() => ({ valid: true })),
      clearErrors: jest.fn(),
    });
    (useCreateVisit as jest.Mock).mockReturnValue({
      createVisit: jest.fn(),
      isPending: false,
    });
  });

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

  it("shows validation errors when present", async () => {
    (useZodValidator as jest.Mock).mockReturnValue({
      validate: jest.fn(() => ({
        success: false,
        errors: {
          name: ["EL nombre no pueder estar vacio"],
          address: ["La dirección no puede estar vacía"],
        },
      })),
      errors: {
        name: ["EL nombre no pueder estar vacio"],
        address: ["La dirección no puede estar vacía"],
      },
      validateField: jest.fn(() => ({ valid: true })),
      clearErrors: jest.fn(),
    });

    const { getByText } = await render(<CreateVisitForm />, { wrapper: Wrapper });
    expect(getByText("EL nombre no pueder estar vacio")).toBeTruthy();
    expect(getByText("La dirección no puede estar vacía")).toBeTruthy();
  });

  it("calls createVisit when validation succeeds", async () => {
    const mockCreateVisit = jest.fn();
    (useCreateVisit as jest.Mock).mockReturnValue({
      createVisit: mockCreateVisit,
      isPending: false,
    });

    const { getByText } = await render(<CreateVisitForm />, { wrapper: Wrapper });
    fireEvent.press(getByText("Crear"));
    expect(mockCreateVisit).toHaveBeenCalledTimes(1);
  });

  it("does not call createVisit when validation fails", async () => {
    const mockCreateVisit = jest.fn();
    (useCreateVisit as jest.Mock).mockReturnValue({
      createVisit: mockCreateVisit,
      isPending: false,
    });
    (useZodValidator as jest.Mock).mockReturnValue({
      validate: jest.fn(() => ({
        success: false,
        errors: { name: ["EL nombre no pueder estar vacio"] },
      })),
      errors: { name: ["EL nombre no pueder estar vacio"] },
      validateField: jest.fn(() => ({ valid: true })),
      clearErrors: jest.fn(),
    });

    const { getByText } = await render(<CreateVisitForm />, { wrapper: Wrapper });
    fireEvent.press(getByText("Crear"));
    expect(mockCreateVisit).not.toHaveBeenCalled();
  });

  it("does not call createVisit when request is pending", async () => {
    const mockCreateVisit = jest.fn();
    (useCreateVisit as jest.Mock).mockReturnValue({
      createVisit: mockCreateVisit,
      isPending: true,
    });
    (useZodValidator as jest.Mock).mockReturnValue({
      validate: jest.fn(() => ({ success: true, data: { name: "Test" } })),
      errors: null,
      validateField: jest.fn(() => ({ valid: true })),
      clearErrors: jest.fn(),
    });

    const { getByText } = await render(<CreateVisitForm />, { wrapper: Wrapper });
    fireEvent.press(getByText("Crear"));
    expect(mockCreateVisit).not.toHaveBeenCalled();
  });
});
