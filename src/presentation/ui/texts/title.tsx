import { Text as T } from "react-native-paper";
import styled from "styled-components/native";
import {
  border,
  BorderProps,
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
  typography,
  TypographyProps,
} from "styled-system";

interface HeadLineStyledProps
  extends
    FlexboxProps,
    SpaceProps,
    BorderProps,
    ColorProps,
    LayoutProps,
    PositionProps,
    TypographyProps {
  children: React.ReactNode;
  type?: keyof typeof text;
  selectable?: boolean;
}

const text = {
  large: "titleLarge",
  medium: "titleMedium",
  small: "titleSmall",
} as const;

const TextWrapper = ({
  children,
  type = "medium",
  style,
  ...props
}: {
  children: React.ReactNode;
  type?: keyof typeof text;
  style?: any;
  [key: string]: any;
}) => {
  return (
    <T variant={text[type]} style={style} {...props}>
      {children}
    </T>
  );
};
export const Title = styled(TextWrapper).attrs<HeadLineStyledProps>(() => ({}))`
  ${flexbox}
  ${space}
  ${border}
  ${color}
  ${layout}
  ${position}
  ${typography}
`;
