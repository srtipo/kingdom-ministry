import { TouchableRipple as TR } from "react-native-paper";

interface TouchableRippleProps {
  onPress?: () => void;
  borderless?: boolean;
  style?: any;
  children: React.ReactNode;
}

export function TouchableRipple({
  onPress,
  borderless,
  style,
  children,
}: TouchableRippleProps) {
  return (
    <TR onPress={onPress} borderless={borderless} style={style}>
      {children}
    </TR>
  );
}
