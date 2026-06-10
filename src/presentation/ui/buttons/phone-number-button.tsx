import { useState } from "react";
import { Linking, View } from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Icon } from "../icons/icon";
import { ScreenLoading } from "../loaders/screen-loading";
import { Text } from "../texts/text";
import { IconButton } from "./icon-button";
import { Button } from "./ui-button";
export function PhoneNumberButton({
  phone,
  onfail,
  type = "compact",
  style,
}: {
  phone: string;
  onfail?: (error: string) => void;
  type?: "compact" | "large";
  style?: any;
}) {
  const colors = useThemeColor();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    <View style={style}>
      {type === "compact" ? (
        <IconButton
          type={"contained-tonal"}
          icon={"phone-outline"}
          iconSize={15}
          borderRadius={10}
          color={colors.card}
          style={{ backgroundColor: "#019BF2" }}
          onPress={makeCall}
        ></IconButton>
      ) : (
        <Button
          type={"contained-tonal"}
          borderRadius={10}
          style={{ backgroundColor: "#019BF2" }}
          onPress={makeCall}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Icon type={"phone-outline"} size={15} color={colors.card} />
            <Text fontWeight={"bold"} color={colors.card}>
              {"Llamar"}
            </Text>
          </View>
        </Button>
      )}
      <ScreenLoading visible={isLoading} />
    </View>
  );
}
