import { getContextColors } from "@/src/presentation/helpers/get-context-color";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Text } from "@/src/presentation/ui/texts/text";
import React from "react";
import { View } from "react-native";

export function VisitDateCard({
  icon,
  color,
  label,
  date,
}: {
  icon: React.ReactElement<{ color: string }>;
  color: string;
  label: string;
  date: string;
}) {
  const { onSurfaceVariant, outline } = useThemeColor();
  const { backgroundColor, textColor, borderColor } = getContextColors(
    color,
    onSurfaceVariant,
    outline,
  );

  const clonedIcon = React.cloneElement(icon, {
    color: textColor,
  });
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        backgroundColor: backgroundColor,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <View style={{ flexShrink: 1, flex: 1 }}>
        <Text type={"small"} color={textColor} fontWeight={"bold"}>
          {label}
        </Text>
        <Text
          ellipsizeMode="tail"
          type={"large"}
          color={textColor}
          fontWeight={"bold"}
        >
          {date}
        </Text>
      </View>
      {clonedIcon}
    </View>
  );
}
