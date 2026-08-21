import EditVisitReminders from "@/src/presentation/modules/configs/visit-reminders/components/edit-visit-reminders";
import RemindersHeader from "@/src/presentation/modules/configs/visit-reminders/components/reminders-header";
import VisitRemindersView from "@/src/presentation/modules/configs/visit-reminders/components/visit-reminders-view";
import {
  converReminderfromMinutes,
  converReminderToMinutes,
} from "@/src/presentation/modules/configs/visit-reminders/helpers/reminder-conversion";
import { VisitReminder } from "@/src/presentation/modules/configs/visit-reminders/types/visit-reminder";
import { useGetNotificationConfigs } from "@/src/presentation/modules/visits/hooks/use-get-notification-configs";
import useUpsertNotificationConfigs from "@/src/presentation/modules/visits/hooks/use-upsert-notification-configs";
import { Card } from "@/src/presentation/ui/cards/card";
import { Divider } from "@/src/presentation/ui/dividers/divider";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { HeadLine } from "@/src/presentation/ui/texts/head-line";
import { Text } from "@/src/presentation/ui/texts/text";
import { useContext, useState } from "react";
import { ScrollView } from "react-native";

export default function ConfigsScene() {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const { data: storedConfigs = [] } = useGetNotificationConfigs();
  const { showSnackbar } = useContext(SnackBarContext);
  const { upsertNotificationConfigs, isPending } = useUpsertNotificationConfigs(
    {
      onSuccess: () => {
        setMode("view");
        showSnackbar.success("Configuración guardada");
      },
      onError: () => {
        showSnackbar.error("Error al guardar la configuración");
      },
    },
  );

  const mapped = storedConfigs.map((reminder) => ({
    id: reminder.id,
    ...converReminderfromMinutes(reminder.time),
  }));

  const handleSave = (draft: VisitReminder[]) => {
    upsertNotificationConfigs({
      items: draft.map((reminder) => ({
        id: reminder.id,
        time: converReminderToMinutes(reminder),
      })),
      options: { previousIds: storedConfigs.map((reminder) => reminder.id) },
    });
  };

  return (
    <ScrollView style={{ padding: 10, paddingBottom: 20, flex: 1 }}>
      <HeadLine type={"medium"} fontWeight={"bold"}>
        Ajustes
      </HeadLine>
      <Text>Personaliza la aplicación a tu manera</Text>
      <Card
        p={15}
        borderRadius={10}
        style={{ marginTop: 16, marginBottom: 30 }}
      >
        <RemindersHeader
          title={"Recordatorios por visita"}
          subtitle={"Se crean automáticamente al registrar cada visita"}
          editing={mode === "edit"}
          onEditPress={() => setMode(mode === "edit" ? "view" : "edit")}
        />
        <Divider style={{ marginBottom: 12 }} />
        {mode === "view" ? (
          <VisitRemindersView value={mapped} />
        ) : (
          <EditVisitReminders
            value={mapped}
            onSave={handleSave}
            isSaving={isPending}
          />
        )}
      </Card>
    </ScrollView>
  );
}
