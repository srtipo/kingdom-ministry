import { Button } from "@/ui/buttons/ui-button";
import { SearchBar } from "@/ui/search-bar/search-bar";
import { HeadLine } from "@/ui/texts/head-line";
import { Text } from "@/ui/texts/text";
import { View } from "react-native";
import VisitList from "../components/visit-list";
import { useGetVisits } from "../hooks/use-get-visits";

export default function VisitOrganizerScene() {
  const { data: visits } = useGetVisits();

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
        <VisitList visits={visits || []} />
      </View>
    </View>
  );
}
