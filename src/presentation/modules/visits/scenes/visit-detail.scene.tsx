import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";

import { Loading } from "@/src/presentation/ui/loaders/loading";
import { ScrollMask } from "@/src/presentation/ui/mask";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { Text } from "@/src/presentation/ui/texts/text";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useLayoutEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { cancelVisitReminders } from "../../notifications/schedules/visit.notification";
import { AttendanceHistoryCard } from "../attendances/components/attendance-history-card";
import { DeleteVisitWarningModal } from "../components/delete-visit-warning.modal";
import { VisitHeaderActions } from "../components/visit-header-actions";
import EditGeneralInfoModal from "../details/components/edit-general-info.modal";
import { GeneralInfo } from "../details/components/general-info";
import { ImportantDates } from "../details/components/important-dates";
import { VisitDetailFooter } from "../details/components/visit-detail-footer";
import { useGetVisitDetail } from "../details/hooks/get-visit-datail";
import useDeleteVisit from "../hooks/use-delete-visit";

export default function VisitDetailScene({ id }: { id: string }) {
  const colors = useThemeColor();
  const navigation = useNavigation();
  const router = useRouter();
  const { showSnackbar } = useContext(SnackBarContext);
  const { data, isLoading } = useGetVisitDetail(id);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { deleteVisit, isPending: isDeletingVisit } = useDeleteVisit({
    onSuccess: async () => {
      try {
        await cancelVisitReminders({ visitId: id });
      } catch (error) {
        if (__DEV__) {
          console.warn(
            "[notifications] failed to cancel visit reminders",
            error,
          );
        }
      }
      setIsDeleteModalVisible(false);
      router.back();
      showSnackbar.success("Visita eliminada");
    },
    onError: () => {
      showSnackbar.error("Error al eliminar la visita");
    },
  });

  useLayoutEffect(() => {
    if (!data) {
      navigation.setOptions({ headerRight: undefined });
      return;
    }
    navigation.setOptions({
      headerRight: () => (
        <VisitHeaderActions
          onEdit={() => setIsEditModalVisible(true)}
          onDelete={() => setIsDeleteModalVisible(true)}
        />
      ),
    });
  }, [navigation, data]);

  if (isLoading) {
    return <Loading />;
  }
  if (!data) {
    return <Text>Visit not found</Text>;
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollMask top bottom edgeHeight={15}>
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
          <View
            style={{ padding: 10, display: "flex", gap: 10, marginBottom: 100 }}
          >
            <GeneralInfo visit={data} />
            <ImportantDates visit={data} />
            <AttendanceHistoryCard visit={data} />
          </View>
        </ScrollView>
      </ScrollMask>
      <VisitDetailFooter visit={data} />
      <EditGeneralInfoModal
        visit={data}
        isVisible={isEditModalVisible}
        onCloseModal={() => setIsEditModalVisible(false)}
      />
      <DeleteVisitWarningModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={() => deleteVisit({ id: data.id })}
        isLoading={isDeletingVisit}
      />
    </View>
  );
}
