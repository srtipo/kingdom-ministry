import { Card } from "@/src/presentation/ui/cards/card";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Text } from "@/src/presentation/ui/texts/text";
import { View } from "react-native";
import CreateVisitModal from "./create-visit.modal";
export function NoVisitCard() {
  return (
    <Card
      type={"contained"}
      display={"flex"}
      flexDirection={"column"}
      itemsCenter
      border={"dashed"}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          padding: 20,
        }}
      >
        <Icon type={"account-multiple"} size={40} />
        <Text>No tienes revisitas para esta fecha</Text>
        <CreateVisitModal />
      </View>
    </Card>
  );
}
