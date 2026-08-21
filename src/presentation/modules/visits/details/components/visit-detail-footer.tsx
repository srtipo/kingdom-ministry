import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Platform, StyleSheet, View } from "react-native";
import { RegisterAttendanceButton } from "../../attendances/components/register-attendance-button";

export function VisitDetailFooter({ visit }: { visit: IVisit }) {
  const colors = useThemeColor();
  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.elevation.level2,
          borderTopColor: colors.outlineVariant,
        },
      ]}
    >
      <RegisterAttendanceButton
        type={visit.type}
        visitId={visit.id}
        name={visit.name}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  button: {
    width: "100%",
  },
});
