import { StyleProp, ViewStyle } from "react-native";
import { SegmentedButtons as SB } from "react-native-paper";
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
  width,
  WidthProps,
} from "styled-system";

type ButtonItem = {
  value: string;
  label?: string;
  icon?: string | undefined | React.FC;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  uncheckedColor?: string;
  checkedColor?: string;
};

const SegmentedWrapper = ({
  buttons,
  value,
  onValueChange,
  style,
  ...props
}: any) => {
  return (
    <SB
      value={value}
      onValueChange={onValueChange}
      buttons={buttons}
      style={style}
      {...props}
    />
  );
};

const UiSegmented = styled(SegmentedWrapper).attrs<
  BorderProps &
    ColorProps &
    FlexboxProps &
    LayoutProps &
    PositionProps &
    SpaceProps &
    BorderRadiusProps &
    WidthProps
>(() => ({}))`
  ${border}
  ${color}
  ${flexbox}
  ${layout}
  ${position}
  ${space}
  ${borderRadius}
  ${width}
`;

export function SegmentedButton({
  buttons,
  value,
  onValueChange,
  ...props
}: {
  buttons: ButtonItem[];
  value?: string;
  onValueChange?: (v: string) => void;
  [key: string]: any;
}) {
  return (
    <UiSegmented
      buttons={buttons}
      value={value}
      onValueChange={onValueChange}
      density="regular"
      {...props}
    />
  );
}

export default SegmentedButton;
