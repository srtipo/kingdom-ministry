import { ActivityIndicator, View } from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Portal } from "../portal/portal";

export function ScreenLoading({ visible }: { visible: boolean }) {
  const colors = useThemeColor();
  return (
    <Portal>
      {visible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "transparent",
              padding: 10,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
              }}
            >
              <ActivityIndicator size={"large"} color={colors.primary} />
            </View>
          </View>
        </View>
      )}
    </Portal>
  );
}
