import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { useContext } from "react";
import { ScrollView } from "react-native";
import { GeneralInfo } from "../details/components/general-info";
import { ImportantDates } from "../details/components/important-dates";
import { VisitHistory } from "../details/components/visit-history";
import { useGetDateStatusColor } from "../helpers/get-date-color";
import { VisitTypeEnum } from "../type/visit-type.enum";

// Nota: Deberías crear este hook en '../hooks/use-get-visit'
// Por ahora, este es un ejemplo de cómo se vería la escena.
// import { useGetVisit } from "../hooks/use-get-visit";

const visitTypeTranslation = {
  [VisitTypeEnum.visit]: "Revisita",
  [VisitTypeEnum.course]: "Curso",
};

export default function VisitDetailScene({ id }: { id: number }) {
  const colors = useThemeColor();
  const { showSnackbar } = useContext(SnackBarContext);

  // Aquí llamarías a tu hook para obtener los datos de la visita
  // const { data: visit, isLoading } = useGetVisit(id);

  // Mock de datos para visualización (reemplazar con el hook real)
  const visit = {
    name: "Cargando...",
    address: "Cargando...",
    phone: "",
    next_visit: new Date().toISOString(),
    type: VisitTypeEnum.visit,
    notes: "",
  };

  const visitChipColor = useGetDateStatusColor(visit.next_visit);

  const onFail = (error: string) => {
    showSnackbar.error(error);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <GeneralInfo />
      <ImportantDates />
      <VisitHistory />
    </ScrollView>
  );
}
