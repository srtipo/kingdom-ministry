import { useState } from "react";
import { ActivityIndicator, Linking, View } from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Portal } from "../portal/portal";
import { IconButton } from "./icon-button";
export function PhoneNumberButton({
  phone,
  onfail,
}: {
  phone: string;
  onfail?: (error: string) => void;
}) {
  const colors = useThemeColor();
  const [isLoading, setIsLoading] = useState(false);
  const makeCall = async () => {
    setIsLoading(true);
    const url = `tel:${phone}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        setIsLoading(false);
      } else {
        onfail?.("Este dispositivo no admite llamadas telefónicas");
        setIsLoading(false);
      }
    } catch (_) {
      setIsLoading(false);
      onfail?.("No se pudo iniciar la llamada");
    }
  };

  return (
    <>
      <IconButton
        type={"contained-tonal"}
        icon={"phone-outline"}
        iconSize={15}
        borderRadius={10}
        color={colors.card}
        style={{ backgroundColor: "#019BF2" }}
        onPress={makeCall}
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
