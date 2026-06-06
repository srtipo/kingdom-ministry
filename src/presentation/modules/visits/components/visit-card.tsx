import { formatDate } from "@/src/presentation/helpers/format-date";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { IconButton } from "@/src/presentation/ui/buttons/icon-button";
import { PhoneNumberButton } from "@/src/presentation/ui/buttons/phone-number-button";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { WhatsAppButton } from "@/src/presentation/ui/buttons/whats-app-button";
import { Card } from "@/src/presentation/ui/cards/card";
import { Chip } from "@/src/presentation/ui/chips/chip";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { Text } from "@/src/presentation/ui/texts/text";
import dayjs from "dayjs";
import { useContext } from "react";
import { View } from "react-native";
import { useGetDateStatusColor } from "../helpers/get-date-color";
import { VisitTypeEnum } from "../type/visit-type.enum";
import { IVisit } from "../type/visit.interface";

const visitTypeTranslation = {
  [VisitTypeEnum.visit]: "Revisita",
  [VisitTypeEnum.course]: "Curso",
};

export default function VisitCard({ visit }: { visit: IVisit }) {
  const { name, address, phone, next_visit, type, notes } = visit;
  const colors = useThemeColor();
  const { showSnackbar } = useContext(SnackBarContext);
  const visitChipColor = useGetDateStatusColor(next_visit);
  const getVisitColor = () => {
    switch (type) {
      case VisitTypeEnum.visit:
        return "#E1712B";
      case VisitTypeEnum.course:
        return "#8207DB";
    }
  };
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
      p={15}
      borderRadius={10}
      style={{
        borderColor: visitChipColor,
        borderWidth: visitChipColor === colors.chips.bad ? 1 : 0,
      }}
    >
      <View style={{ display: "flex", justifyContent: "center" }}></View>
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

          <Text type={"large"} fontWeight={"bold"} color={getVisitColor()}>
            {visitTypeTranslation[type]}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Icon type={"pencil-outline"} size={22} />
          <Icon type={"delete-outline"} size={22} color={colors.danger} />
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
          <Chip
            color={visitChipColor}
            selectedColor={"black"}
            style={{
              opacity: 0.8,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}
            >
              <Icon type={"clock-outline"} size={20} color={colors.scrim} />
              <Text fontWeith={"bold"} color={colors.scrim}>
                {adaptiveDateFormat(next_visit)}
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
            height: 30,
          }}
        >
          <Icon type={"map-marker"} size={22} />
          <Text>{address}</Text>
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
              {notes}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 5,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button type={"contained"} width={"80%"} height={40}>
          {`Registrar ${visitTypeTranslation[type]}`}
        </Button>
        <IconButton
          icon={"clipboard-text-outline"}
          type={"outlined"}
          iconSize={20}
        />
      </View>
    </Card>
  );
}
