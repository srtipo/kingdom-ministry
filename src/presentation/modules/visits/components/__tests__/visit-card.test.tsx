import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock("@/src/presentation/hooks/use-theme-color", () => ({
  useThemeColor: () => ({
    chips: { bad: "red", warning: "orange", good: "green" },
    scrim: "#000",
    elevation: { level2: "#eee" },
  }),
}));

jest.mock("@/src/presentation/modules/visits/helpers/get-date-color", () => ({
  useGetDateStatusColor: () => "orange",
}));

jest.mock("@/src/presentation/ui/buttons/phone-number-button", () => ({
  PhoneNumberButton: () => null,
}));

jest.mock("@/src/presentation/ui/buttons/whats-app-button", () => ({
  WhatsAppButton: () => null,
}));

import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import VisitCardFixture from "../visit-card";
import { VisitTypeEnum } from "../../type/visit-type.enum";

const mockShowSnackbar = { error: jest.fn(), success: jest.fn() };

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SnackBarContext.Provider value={{ showSnackbar: mockShowSnackbar }}>
      {children}
    </SnackBarContext.Provider>
  );
}

describe("VisitCard", () => {
  const visit = {
    id: "1",
    name: "John Doe",
    address: "123 Main St",
    phone: "555-0100",
    notes: "Some notes",
    type: VisitTypeEnum.visit,
    next_visit: new Date(),
  };

  it("renders visit name and address", async () => {
    const { getByText } = await render(<VisitCardFixture visit={visit} />, { wrapper: Wrapper });
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("123 Main St")).toBeTruthy();
  });

  it("renders phone when provided", async () => {
    const { getByText } = await render(<VisitCardFixture visit={visit} />, { wrapper: Wrapper });
    expect(getByText("555-0100")).toBeTruthy();
  });

  it("renders visit type translation", async () => {
    const { getByText } = await render(<VisitCardFixture visit={visit} />, { wrapper: Wrapper });
    expect(getByText("Revisita")).toBeTruthy();
  });

  it("does not render phone section when phone is undefined", async () => {
    const visitWithoutPhone = { ...visit, phone: undefined };
    const { queryByText } = await render(<VisitCardFixture visit={visitWithoutPhone} />, { wrapper: Wrapper });
    expect(queryByText("555-0100")).toBeNull();
  });

  it("does not render notes section when notes is undefined", async () => {
    const visitWithoutNotes = { ...visit, notes: undefined };
    const { queryByText } = await render(<VisitCardFixture visit={visitWithoutNotes} />, { wrapper: Wrapper });
    expect(queryByText("Some notes")).toBeNull();
  });

  it("renders RegisterVisitButton", async () => {
    const { getByText } = await render(<VisitCardFixture visit={visit} />, { wrapper: Wrapper });
    expect(getByText("Registrar Revisita")).toBeTruthy();
  });
});
