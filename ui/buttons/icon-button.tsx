import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { IconButton as IB } from 'react-native-paper';
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
interface IconButtonProps {
  iconSize: number;
  color?: string;
  icon: (typeof MaterialCommunityIcons)['name'];
  type: 'outlined' | 'contained' | 'contained-tonal' | undefined;
  style?: any;
  [key: string]: any;
}

const StyledButton = styled(IconButtonWrapper).attrs<
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

function IconButtonWrapper({ iconSize, icon, color, type, style, ...props }: IconButtonProps) {
  return <IB {...props} size={iconSize} icon={icon} iconColor={color} mode={type} style={style} />;
}
export function IconButton({ size, iconSize, icon, color, type, ...props }: IconButtonProps) {
  return (
    <StyledButton
      icon={icon}
      color={color}
      type={type}
      {...props}
      borderRadius={10}
      iconSize={iconSize}
    />
  );
}
