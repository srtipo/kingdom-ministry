import { Card as C } from "react-native-paper";
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

interface CardStyledProps
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

function CardWapper({
  children,
  style,
  type,
}: {
  children: React.ReactNode;
  style?: any;
  type?: "elevated" | "outlined" | "contained";
}) {
  return (
    <C mode={type} style={style}>
      {children}
    </C>
  );
}

const StyledCard = styled(CardWapper).attrs<CardStyledProps>(() => ({}))`
  ${flexbox}
  ${space}
  ${border}
  ${color}
  ${layout}
  ${position}
  ${borderRadius}
`;

export function Card({
  type,
  children,
  ...props
}: {
  children: React.ReactNode;
  type?: "elevated" | "outlined" | "contained";
  [key: string]: any;
}) {
  return (
    <StyledCard type={type} {...props}>
      {children}
    </StyledCard>
  );
}
