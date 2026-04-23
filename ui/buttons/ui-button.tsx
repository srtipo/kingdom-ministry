import { Button as B } from 'react-native-paper';
import styled from 'styled-components/native';
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
} from 'styled-system';

type ButtonType = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal' | undefined;

const ButtonWrapper = ({
  type,
  children,
  style,
  ...props
}: {
  type?: ButtonType;
  children: React.ReactNode;
  style?: any;
  [key: string]: any;
}) => {
  return (
    <B mode={type} style={style} {...props}>
      {children}
    </B>
  );
};

const UiButton = styled(ButtonWrapper).attrs<
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

export function Button({
  type,
  children,
  ...props
}: {
  type?: ButtonType;
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <UiButton type={type} {...props}>
      {children}
    </UiButton>
  );
}
