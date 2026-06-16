import { useState } from "react";
import { Linking, View } from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Icon } from "../icons/icon";
import { ScreenLoading } from "../loaders/screen-loading";
import { Text } from "../texts/text";
import { IconButton } from "./icon-button";
import { Button } from "./ui-button";

export function WhatsAppButton({
  phone,
  onFail,
  type = "compact",
  style,
}: {
  phone: string;
  onFail?: (error: string) => void;
  type?: "compact" | "large";
  style?: any;
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
    <View style={style}>
      {type === "compact" ? (
        <IconButton
          type={"contained-tonal"}
          icon={"message-outline"}
          iconSize={15}
          borderRadius={10}
          color={colors.card}
          style={{ backgroundColor: "#1daa61" }}
          onPress={openWhatsApp}
        ></IconButton>
      ) : (
        <Button
          type={"contained-tonal"}
          borderRadius={10}
          style={{ backgroundColor: "#1daa61" }}
          onPress={openWhatsApp}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Icon type={"message-outline"} size={15} color={colors.card} />
            <Text fontWeight={"bold"} color={colors.card}>
              {"WhatsApp"}
            </Text>
          </View>
        </Button>
      )}
      <ScreenLoading visible={isLoading} />
    </View>
  );
}
