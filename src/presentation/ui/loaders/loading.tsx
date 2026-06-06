import { ActivityIndicator as PaperActivityIndicator } from "react-native-paper";
import styled from "styled-components/native";
import {
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

interface ActivityIndicatorProps {
  animating?: boolean;
  color?: string;
  hidesWhenStopped?: boolean;
  size?: "small" | "large" | number;
  style?: any;
  [key: string]: any;
}

const StyledAI = styled(ActivityIndicatorWrapper).attrs<
  ColorProps & FlexboxProps & LayoutProps & PositionProps & SpaceProps
>(() => ({}))`
  ${color}
  ${flexbox}
  ${layout}
  ${position}
  ${space}
`;

function ActivityIndicatorWrapper({
  animating,
  color,
  hidesWhenStopped,
  size,
  style,
  ...props
}: ActivityIndicatorProps) {
  return (
    <PaperActivityIndicator
      animating={animating}
      color={color}
      hidesWhenStopped={hidesWhenStopped}
      size={size}
      style={style}
      {...props}
    />
  );
}

export function Loading({
  size = "small",
  ...props
}: ActivityIndicatorProps &
  ColorProps &
  FlexboxProps &
  LayoutProps &
  PositionProps &
  SpaceProps) {
  return <StyledAI size={size} {...props} />;
}
