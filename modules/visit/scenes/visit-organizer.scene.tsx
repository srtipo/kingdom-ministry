import { Button } from "@/ui/buttons/ui-button";
import { SearchBar } from "@/ui/search-bar/search-bar";
import { HeadLine } from "@/ui/texts/head-line";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { VisitTypeEnum } from "../components/visit-card";
import VisitList from "../components/visit-list";

const visits = [
  {
    id: 1,
    name: "Victor",
    adress: "Av. Juan Pablo II, 100",
    phone: "+56 987654321",
    nextVisit: "2023-01-01",
    lastVisit: "2023-01-01",
    type: VisitTypeEnum.visit,
  },
  {
    id: 2,
    name: "jose",
    adress: "Av. Juan Pablo II, 100",
    phone: "+56 987654321",
    nextVisit: "2023-01-01",
    lastVisit: "2023-01-01",
    type: VisitTypeEnum.course,
  },
  {
    id: 3,
    name: "jose",
    adress: "Av. Juan Pablo II, 100",
    phone: "+56 987654321",
    nextVisit: "2023-01-01",
    lastVisit: "2023-01-01",
    type: VisitTypeEnum.course,
  },
];

export default function VisitOrganizerScene() {
  return (
    <View style={{ padding: 10, flex: 1 }}>
      <HeadLine type={"medium"} fontWeight={"bold"}>
        Organizador de Revisitas
      </HeadLine>
      <Text>Gestiona tus revisitas de forma sencilla</Text>
      <View style={{ marginTop: 10 }}>
        <Button type={"contained"} icon={"plus"}>
          Nueva Revisita/Curso
        </Button>
      </View>
      <View style={{ marginTop: 10 }}>
        <SearchBar placeholder={"Buscar por nombre o direccion"} />
      </View>

      <View style={{ marginTop: 10, flex: 1 }}>
        <VisitList visits={visits} />
      </View>
    </View>
  );
}
