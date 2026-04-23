import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Icon as I } from 'react-native-paper';
interface IconProps {
  size: number;
  color?: string;
  type?: (typeof MaterialCommunityIcons)['name'];
}

export function Icon({ size, type, color }: IconProps) {
  return <I size={size} source={type} color={color} />;
}
