import { formatDate } from "@/helpers/format-date";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useGetDateStatusColor } from "@/modules/visit/helpers/get-date-color";
import { IconButton } from "@/ui/buttons/icon-button";
import { Button } from "@/ui/buttons/ui-button";
import { Card } from "@/ui/cards/card";
import { Chip } from "@/ui/chips/chip";
import { Icon } from "@/ui/icons/icon";
import { Text } from "@/ui/texts/text";
import dayjs from "dayjs";
import { View } from "react-native";
import { VisitTypeEnum } from "../type/visit-type.enum";
import { IVisit } from "../type/visit.interface";

const visitTypeTranslation = {
  [VisitTypeEnum.visit]: "Revisita",
  [VisitTypeEnum.course]: "Curso",
};

export default function VisitCard({ visit }: { visit: IVisit }) {
  const { name, address, phone, next_visit, type, notes } = visit;
  const colors = useThemeColor();
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
              <IconButton
                type={"contained-tonal"}
                icon={"phone-outline"}
                iconSize={15}
                borderRadius={10}
                color={colors.card}
                style={{ backgroundColor: "#019BF2" }}
              ></IconButton>
              <IconButton
                type={"contained-tonal"}
                icon={"message-outline"}
                iconSize={15}
                borderRadius={10}
                color={colors.card}
                style={{ backgroundColor: "#1daa61" }}
              ></IconButton>
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
