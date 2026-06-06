import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Icon as I } from "react-native-paper";
import styled from "styled-components/native";
import {
  border,
  borderRadius,
  color,
  flexbox,
  layout,
  position,
  space,
  width,
} from "styled-system";
interface IconProps {
  size: number;
  color?: string;
  type?: (typeof MaterialCommunityIcons)["name"];
  borderRadius?: number;
  [key: string]: any;
}

const IconWrapper = ({ size, type, color, ...props }: IconProps) => {
  return <I size={size} source={type} color={color} {...props} />;
};

const StyledIcon = styled(IconWrapper).attrs<IconProps>(() => ({}))`
  ${borderRadius}
  ${border}
    ${color}
    ${flexbox}
    ${layout}
    ${position}
    ${space}
    ${borderRadius}
    ${width}
`;

export function Icon({ size, type, color, borderRadius }: IconProps) {
  return (
    <StyledIcon
      size={size}
      type={type}
      color={color}
      borderRadius={borderRadius}
    />
  );
}
