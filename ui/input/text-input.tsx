import { ComponentProps } from "react";
import { View } from "react-native";
import type { TextInputProps } from "react-native-paper";
import { HelperText, TextInput as TI } from "react-native-paper";
import styled from "styled-components/native";
import {
  border,
  BorderProps,
  borderRadius,
  BorderRadiusProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
} from "styled-system";

interface TextInputStyledProps
  extends
    FlexboxProps,
    SpaceProps,
    BorderProps,
    ColorProps,
    LayoutProps,
    PositionProps,
    BorderRadiusProps {
  children: React.ReactNode;
}

function TextInputWrapper({
  label,
  value,
  onChangeText,
  error,
  leftIconProps,

  ...props
}: Props) {
  return (
    <TI
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={!!error}
      left={leftIconProps && <TI.Icon {...leftIconProps} />}
      outlineStyle={{ borderRadius: 10 }}
      {...props}
    />
  );
}

const StyledTextInput = styled(TextInputWrapper).attrs<TextInputStyledProps>(
  () => ({}),
)`
  ${flexbox}
  ${space}
  ${border}
  ${color}
  ${layout}
  ${position}
  ${borderRadius}
`;
type Props = Omit<
  TextInputProps,
  "value" | "onChangeText" | "error" | "left"
> & {
  value?: string;
  onChangeText: (text: string) => void;
  error?: string;
  leftIconProps: ComponentProps<typeof TI.Icon>;

  [key: string]: any;
};

export default function TextInput({
  label,
  value,
  onChangeText,
  error,
  leftIconProps,
  multiline = false,
  ...props
}: Props) {
  return (
    <>
      <StyledTextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        leftIconProps={leftIconProps}
        mode="outlined"
        height={!multiline && 40}
        multiline={multiline}
        {...props}
      />
      {error ? (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      ) : (
        <View style={{ height: 10 }} />
      )}
    </>
  );
}

type PropsIcon = ComponentProps<typeof TI.Icon>;

export function InputIcon(props: PropsIcon) {
  return <TI.Icon {...props} />;
}
