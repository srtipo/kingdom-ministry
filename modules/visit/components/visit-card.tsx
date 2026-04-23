import { IconButton } from "@/ui/buttons/icon-button";
import { Button } from "@/ui/buttons/ui-button";
import { Card } from "@/ui/cards/card";
import { Divider } from "@/ui/dividers/divider";
import { Icon } from "@/ui/icons/icon";
import { Text } from "@/ui/texts/text";
import { View } from "react-native";

export enum VisitTypeEnum {
  visit = "visit",
  course = "course",
}

const visitTypeTranslation = {
  [VisitTypeEnum.visit]: "Revisita",
  [VisitTypeEnum.course]: "Curso",
};

export interface VisitCardProps {
  id: number;
  name: string;
  adress: string;
  phone?: string;
  nextVisit?: string;
  lastVisit?: string;
  description?: string;
  type: VisitTypeEnum;
}

export default function VisitCard({ visit }: { visit: VisitCardProps }) {
  const { name, adress, phone, lastVisit, type } = visit;
  const getColor = () => {
    switch (type) {
      case VisitTypeEnum.visit:
        return "#E1712B";
      case VisitTypeEnum.course:
        return "#8207DB";
    }
  };
  return (
    <Card p={15} borderRadius={10}>
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
          <Text type={"large"} fontWeight={"bold"} color={getColor()}>
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
          <Text>{adress}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Icon type={"phone-outline"} size={20} />
          <Text>{phone}</Text>
        </View>
        <Divider height={1} />

        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text fontWeight={"bold"}>{"Fecha de proximo visita: "}</Text>
          <Text>{lastVisit}</Text>
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
