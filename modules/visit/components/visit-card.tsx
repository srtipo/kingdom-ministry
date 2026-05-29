import { formatDate } from "@/helpers/format-date";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useGetDateStatusColor } from "@/modules/visit/helpers/get-date-color";
import { IconButton } from "@/ui/buttons/icon-button";
import { Button } from "@/ui/buttons/ui-button";
import { Card } from "@/ui/cards/card";
import { Chip } from "@/ui/chips/chip";
import { Divider } from "@/ui/dividers/divider";
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
  const { name, address, phone, next_visit, type } = visit;
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text type={"large"} fontWeight={"bold"}>
            {name}
          </Text>
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
          <Icon type={"clipboard-edit-outline"} size={20} />
          <Icon type={"delete-outline"} size={20} />
        </View>
      </View>
      <View style={{ display: "flex", gap: 5, paddingBlock: 10 }}>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Icon type={"map-marker-outline"} size={20} />
          <Text>{address}</Text>
        </View>
        {phone && (
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Icon type={"phone-outline"} size={20} />
            <Text>{phone}</Text>
          </View>
        )}
        <Divider height={1} />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <Text fontWeight={"bold"}>{"Visitar el: "}</Text>
          <Chip
            color={visitChipColor}
            selectedColor={"black"}
            style={{
              opacity: 0.7,
            }}
          >
            {adaptiveDateFormat(next_visit)}
          </Chip>
        </View>
        <Divider height={1} />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 10,
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
