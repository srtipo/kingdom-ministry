import { Badge as B } from "react-native-paper";
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

interface BadgeStyledProps
  extends
    FlexboxProps,
    SpaceProps,
    BorderProps,
    ColorProps,
    LayoutProps,
    PositionProps,
    TypographyProps {
  children?: string | number;
  visible?: boolean;
  size?: number;
  badgeSize?: number;
}

const BadgeWrapper = ({
  children,
  visible,
  size,
  style,
  badgeSize,
  ...props
}: BadgeStyledProps & { style?: any }) => {
  return (
    <B visible={visible} size={badgeSize} style={style} {...props}>
      {children}
    </B>
  );
};

const StyleBadge = styled(BadgeWrapper).attrs<BadgeStyledProps>(() => ({}))`
  ${flexbox}
  ${space}
  ${border}
  ${color}
  ${layout}
  ${position}
  ${typography}
`;

export function Badge({
  children,
  visible,
  size,
  badgeSize,
  ...props
}: BadgeStyledProps) {
  return (
    <StyleBadge
      visible={visible}
      size={size}
      {...props}
      badgeSize={badgeSize}
      px={2}
    >
      {children}
    </StyleBadge>
  );
}
