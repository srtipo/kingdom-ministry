import type { ComponentProps } from "react";
import React from "react";
import { TextInput as TI } from "react-native-paper";

type Props = ComponentProps<typeof TI.Icon>;

export default function InputIcona(props: Props) {
  return <TI.Icon {...props} />;
}
