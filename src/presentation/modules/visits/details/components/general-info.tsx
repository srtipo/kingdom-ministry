import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { PhoneNumberButton } from "@/src/presentation/ui/buttons/phone-number-button";
import { WhatsAppButton } from "@/src/presentation/ui/buttons/whats-app-button";
import { Card } from "@/src/presentation/ui/cards/card";
import { Chip } from "@/src/presentation/ui/chips/chip";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { HeadLine } from "@/src/presentation/ui/texts/head-line";
import { Text } from "@/src/presentation/ui/texts/text";
import { View } from "react-native";
import { VisitTypeEnum } from "../../type/visit-type.enum";
import { IVisitDetail } from "../types/visit-detail.interface";
const visitTypeTranslation = {
  [VisitTypeEnum.visit]: "Revisita",
  [VisitTypeEnum.course]: "Curso",
};

export function GeneralInfo({ visit }: { visit: IVisitDetail }) {
  const colors = useThemeColor();

  return (
    <Card
      type="elevated"
      borderRadius={20}
      overflow="hidden"
      backgroundColor={colors.surface}
    >
      <View
        style={{
          backgroundColor: colors.primary,
          padding: 20,
        }}
      >
        <HeadLine color={colors.onPrimary}>{visit.name}</HeadLine>
        <View
          style={{ display: "flex", flexDirection: "row", marginBlock: 10 }}
        >
          <Chip borderRadius={20} color={"rgba(255, 255, 255, 0.2)"}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: 100,
              }}
            >
              <Icon type={"tag-outline"} size={16} color={colors.onPrimary} />
              <Text color={colors.onPrimary} fontWeight={"bold"}>
                {visitTypeTranslation[visit.type]}
              </Text>
            </View>
          </Chip>
        </View>
      </View>
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
