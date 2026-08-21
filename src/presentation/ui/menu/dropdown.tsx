import { ComponentProps, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Icon, Menu as PaperMenu, Text, TouchableRipple } from "react-native-paper";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
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

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownStyledProps
  extends
    FlexboxProps,
    SpaceProps,
    BorderProps,
    ColorProps,
    LayoutProps,
    PositionProps,
    BorderRadiusProps,
    WidthProps {}

type MenuProps = ComponentProps<typeof PaperMenu>;

interface DropdownWrapperProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  minWidth?: number;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}

function DropdownWrapper({
  value,
  options,
  onChange,
  disabled,
  minWidth,
  placeholder,
  style,
  ...props
}: DropdownWrapperProps) {
  const colors = useThemeColor();
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const selected = options.find((o) => o.value === value);
  const selectedLabel = selected?.label ?? placeholder ?? "";
  const handleSelect = (next: string) => {
    onChange(next);
    setVisible(false);
  };
  const containerStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.outline,
    opacity: disabled ? 0.6 : 1,
    minWidth: minWidth ?? 140,
  };
  const anchor = (
    <TouchableRipple
      onPress={open}
      disabled={disabled}
      style={[containerStyle, style]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Text>{selectedLabel}</Text>
        <Icon source="chevron-down" size={18} color={colors.primary} />
      </View>
    </TouchableRipple>
  );
  const menuProps: Partial<MenuProps> = {
    onDismiss: close,
    anchorPosition: "bottom",
  };
  return (
    <View {...props}>
      <PaperMenu {...menuProps} visible={visible} anchor={anchor}>
        {options.map((option) => (
          <PaperMenu.Item
            key={option.value}
            title={option.label}
            onPress={() => handleSelect(option.value)}
          />
        ))}
      </PaperMenu>
    </View>
  );
}

const StyledDropdown = styled(DropdownWrapper).attrs<DropdownStyledProps>(
  () => ({}),
)`
  ${flexbox}
  ${space}
  ${border}
  ${color}
  ${layout}
  ${position}
  ${borderRadius}
  ${width}
`;

export function Dropdown({
  value,
  options,
  onChange,
  disabled,
  minWidth,
  placeholder,
  style,
  ...props
}: {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  minWidth?: number;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}) {
  return (
    <StyledDropdown
      value={value}
      options={options}
      onChange={onChange}
      disabled={disabled}
      minWidth={minWidth}
      placeholder={placeholder}
      style={style}
      {...props}
    />
  );
}
