import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { PhoneNumberButton } from "@/src/presentation/ui/buttons/phone-number-button";
import { WhatsAppButton } from "@/src/presentation/ui/buttons/whats-app-button";
import { Card } from "@/src/presentation/ui/cards/card";
import { Chip } from "@/src/presentation/ui/chips/chip";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { HeadLine } from "@/src/presentation/ui/texts/head-line";
import { Text } from "@/src/presentation/ui/texts/text";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { visitTypeTranslation } from "../../constants/visit-type-translation";
import { useGetVisitColor } from "../../hooks/use-get-visit-colors";
import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";

export function GeneralInfo({ visit }: { visit: IVisit }) {
  const colors = useThemeColor();
  const {
    backgroundColor: backgroundTypeColor,
    gradientColor: gradientTypeColor,
    textColor: textTypeColor,
  } = useGetVisitColor(visit.type);

  return (
    <Card
      type="elevated"
      borderRadius={20}
      overflow="hidden"
      backgroundColor={colors.surface}
    >
      <LinearGradient
        colors={[backgroundTypeColor, gradientTypeColor]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={{ padding: 20 }}
      >
        <HeadLine color={textTypeColor}>{visit.name}</HeadLine>
        <View
          style={{ display: "flex", flexDirection: "row", marginBlock: 10 }}
        >
          <Chip borderRadius={20} color={"rgba(128, 128, 128, 0.1)"}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: 100,
              }}
            >
              <Icon type={"tag-outline"} size={16} color={textTypeColor} />
              <Text color={textTypeColor}>
                {visitTypeTranslation[visit.type]}
              </Text>
            </View>
          </Chip>
        </View>
      </LinearGradient>
      <View style={{ padding: 20, display: "flex", gap: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View
            style={{
              backgroundColor: colors.elevation.level1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
            }}
          >
            <Icon
              type={"map-marker-outline"}
              size={20}
              color={colors.primary}
            />
          </View>
          <View style={{ flexShrink: 1, flex: 1 }}>
            <Text type={"small"}>{"Dirección"}</Text>
            <Text ellipsizeMode="tail" type={"large"}>
              {visit.address}
            </Text>
          </View>
        </View>
        {visit.notes && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View
              style={{
                backgroundColor: colors.elevation.level1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
              }}
            >
              <Icon
                type={"file-document-outline"}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={{ flexShrink: 1, flex: 1 }}>
              <Text type={"small"}>{"Notas"}</Text>
              <Text ellipsizeMode="tail" type={"large"}>
                {visit.notes}
              </Text>
            </View>
          </View>
        )}
        {visit.phone && (
          <View
            style={{
              backgroundColor: colors.elevation.level1,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.elevation.level2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                }}
              >
                <Icon type={"phone-outline"} size={20} color={colors.primary} />
              </View>
              <View style={{}}>
                <Text type={"small"}>{"Teléfono"}</Text>
                <Text selectable={true} type={"large"}>
                  {visit.phone}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                gap: 15,
                marginTop: 10,
              }}
            >
              <PhoneNumberButton
                phone={visit.phone}
                type={"large"}
                style={{ flex: 1 }}
              />
              <WhatsAppButton
                phone={visit.phone}
                type={"large"}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}
      </View>
    </Card>
  );
}
