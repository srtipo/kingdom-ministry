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

import { RegisterVisitButton } from "../register-visit-button";
import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";

describe("RegisterVisitButton", () => {
  it("renders with visit text by default", async () => {
    const { getByText } = await render(<RegisterVisitButton />);
    expect(getByText("Registrar Revisita")).toBeTruthy();
  });

  it("renders with course text for course type", async () => {
    const { getByText } = await render(
      <RegisterVisitButton type={VisitTypeEnum.course} />,
    );
    expect(getByText("Registrar Curso")).toBeTruthy();
  });

  it("renders with visit text for visit type", async () => {
    const { getByText } = await render(
      <RegisterVisitButton type={VisitTypeEnum.visit} />,
    );
    expect(getByText("Registrar Revisita")).toBeTruthy();
  });
});
