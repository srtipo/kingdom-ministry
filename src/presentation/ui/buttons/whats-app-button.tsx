import { useState } from "react";
import { ActivityIndicator, Linking, View } from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Portal } from "../portal/portal";
import { IconButton } from "./icon-button";

export function WhatsAppButton({
  phone,
  onFail,
}: {
  phone: string;
  onFail?: (error: string) => void;
}) {
  const colors = useThemeColor();
  const [isLoading, setIsLoading] = useState(false);
  const openWhatsApp = async () => {
    const url = `https://wa.me/${phone}`;
    setIsLoading(true);
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        onFail?.("WhatsApp no está instalado en este dispositivo");
      }
    } catch (_) {
      setIsLoading(false);
      onFail?.("No se pudo abrir WhatsApp");
    }
  };
  return (
    <>
      <IconButton
        type={"contained-tonal"}
        icon={"message-outline"}
        iconSize={15}
        borderRadius={10}
        color={colors.card}
        style={{ backgroundColor: "#1daa61" }}
        onPress={openWhatsApp}
      ></IconButton>
      <Portal>
        {isLoading && (
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
    </>
  );
}
