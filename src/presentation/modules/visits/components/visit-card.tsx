import {
  IVisit,
  VisitTypeEnum,
} from "@/src/core/modules/visits/interfaces/visit.interface";
import { formatDate } from "@/src/presentation/helpers/format-date";
import { getContextColors } from "@/src/presentation/helpers/get-context-color";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { PhoneNumberButton } from "@/src/presentation/ui/buttons/phone-number-button";
import { WhatsAppButton } from "@/src/presentation/ui/buttons/whats-app-button";
import { Card } from "@/src/presentation/ui/cards/card";
import { Chip } from "@/src/presentation/ui/chips/chip";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { Text } from "@/src/presentation/ui/texts/text";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { RegisterAttendanceButton } from "../attendances/components/register-attendance-button";
import {
  DateStatus,
  getDateStatus,
  useGetDateStatusColor,
} from "../helpers/get-date-color";
import { useGetVisitColor } from "../hooks/use-get-visit-colors";

const visitTypeTranslation = {
  [VisitTypeEnum.visit]: "Revisita",
  [VisitTypeEnum.course]: "Curso",
};

export default function VisitCard({ visit }: { visit: IVisit }) {
  const router = useRouter();
  const goToDetail = () => {
    router.push({
      pathname: "/visit/[id]",
      params: { id: visit.id.toString() },
    });
  };

  const { name, address, phone, nextVisit, type, notes } = visit;
  const { backgroundColor: backgroundTypeColor, textColor: textTypeColor } =
    useGetVisitColor(type);
  const colors = useThemeColor();
  const { showSnackbar } = useContext(SnackBarContext);
  const visitChipColor = useGetDateStatusColor(nextVisit);

  const { backgroundColor, textColor } = getContextColors(visitChipColor);
  const adaptiveDateFormat = (date?: Date | string) => {
    const now = dayjs();
    const time = dayjs(date).format("hh:mm A");
    const targetDate = dayjs(date);
    if (now.isSame(targetDate, "day")) {
      return `Hoy a las ${time}`;
    }
    if (targetDate.isSame(now.add(1, "day"), "day")) {
      return `Mañana a las ${time}`;
    }

    return formatDate(date);
  };

  const onFail = (error: string) => {
    showSnackbar.error(error);
  };
  return (
    <Card
      onPress={goToDetail}
      p={15}
      borderRadius={10}
      style={{
        borderColor: "#ff5d48",
        borderWidth: getDateStatus(nextVisit) === DateStatus.bad ? 1 : 0,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{
              maxWidth: 200,
            }}
          >
            <Text type={"large"} fontWeight={"bold"}>
              {name}
            </Text>
          </View>
          <Chip color={backgroundTypeColor}>
            <Text color={textTypeColor}>{visitTypeTranslation[type]}</Text>
          </Chip>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Icon type={"chevron-right"} size={25} />
        </View>
      </View>
      <View style={{ display: "flex", gap: 5, paddingBlock: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Chip color={backgroundColor}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}
            >
              <Icon type={"clock-outline"} size={20} color={textColor} />
              <Text fontWeight={"bold"} color={textColor}>
                {adaptiveDateFormat(nextVisit)}
              </Text>
            </View>
          </Chip>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            minHeight: 30,
          }}
        >
          <Icon type={"map-marker"} size={22} />
          <Text
            style={{ flexShrink: 1, flex: 1 }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {address}
          </Text>
        </View>
        {phone && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Icon type={"phone"} size={22} />
              <Text selectable={true}>{phone}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <PhoneNumberButton phone={phone} onfail={onFail} />
              <WhatsAppButton phone={phone} onFail={onFail} />
            </View>
          </View>
        )}
        {notes && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              paddingBlock: 10,
              backgroundColor: colors.elevation.level2,
              paddingRight: 10,
              paddingLeft: 5,
              width: "100%",
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Icon type={"file-document"} size={20} />
            <Text
              style={{ flexShrink: 1, flex: 1 }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              d{notes}
            </Text>
          </View>
        )}
      </View>
      <RegisterAttendanceButton type={type} visitId={visit.id} />
    </Card>
  );
}
