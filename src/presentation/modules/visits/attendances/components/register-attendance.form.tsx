import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import useZodValidator from "@/src/presentation/hooks/use-zod-validator";
import { z } from "@/src/presentation/libraries/zod";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import NativeDateTime from "@/src/presentation/ui/input/date-hour-picker";
import TextInput from "@/src/presentation/ui/input/text-input";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { useContext, useState } from "react";
import { useFetchNotificationConfigs } from "../../hooks/use-fetch-notification-configs";
import { reScheduleVisitReminders } from "../../../notifications/schedules/visit.notification";
import useCreateAttendance from "../hooks/use-create-attendance";

const attendanceSchema = z.object({
  date: z.date("Indica la fecha de la visita"),
  nextVisitDate: z.date("Indica la fecha de la próxima visita"),
  notes: z.string().optional().nullable(),
});

export default function RegisterAttendanceForm({
  visitId,
  name,
  type = VisitTypeEnum.visit,
  onSuccess,
}: {
  visitId: string;
  name: string;
  type?: VisitTypeEnum;
  onSuccess?: () => void;
}) {
  const { showSnackbar } = useContext(SnackBarContext);
  const colors = useThemeColor();
  const fetchNotificationConfigs = useFetchNotificationConfigs();
  const [form, setForm] = useState<{
    date: Date | null;
    nextVisitDate: Date | null;
    notes: string | null;
  }>({
    date: new Date(),
    nextVisitDate: null,
    notes: null,
  });

  const { validate, errors, validateField } = useZodValidator<{
    date: Date;
    nextVisitDate: Date;
    notes: string | undefined;
  }>(attendanceSchema);

  const { createAttendance, isPending } = useCreateAttendance({
    onSuccess: async () => {
      showSnackbar.success("Visita registrada correctamente");
      try {
        const configs = await fetchNotificationConfigs();
        await reScheduleVisitReminders({
          visitId,
          name,
          type,
          nextVisit: new Date(form.nextVisitDate as Date),
          configs,
        });
      } catch (error) {
        if (__DEV__) {
          console.warn(
            "[notifications] failed to reschedule visit reminders after attendance",
            error,
          );
        }
      }
      onSuccess?.();
    },
    onError: () => {
      showSnackbar.error("Error al registrar la visita");
    },
  });

  const handleChangeText = (path: string, value: unknown) => {
    setForm({ ...form, [path]: value });
    validateField(path, value);
  };

  const handleSave = () => {
    const result = validate(form);
    if (!result.success) {
      showSnackbar.error("Corrige los errores antes de guardar");
      return;
    }
    createAttendance({
      visitId,
      date: result.data.date.toISOString(),
      nextVisitDate: result.data.nextVisitDate.toISOString(),
      notes: result.data.notes ?? undefined,
    });
  };

  const nextVisitIconColor =
    type === VisitTypeEnum.visit
      ? colors.visitType.onVisit
      : colors.visitType.onCourse;

  return (
    <>
      <NativeDateTime
        label="Fecha de esta visita"
        value={form.date}
        onChange={(value) => handleChangeText("date", value ?? null)}
        error={errors?.date?.at(0)}
        leftIconProps={{ icon: "calendar", color: colors.primary }}
      />
      <TextInput
        label="Notas (opcional)"
        value={form.notes ?? ""}
        onChangeText={(value) => handleChangeText("notes", value)}
        placeholder="¿Qué temas se trataron? ¿Cómo respondió la persona?"
        multiline
        leftIconProps={{ icon: "note", color: colors.primary }}
      />
      <NativeDateTime
        label="Próxima visita"
        value={form.nextVisitDate}
        onChange={(value) => handleChangeText("nextVisitDate", value)}
        error={errors?.nextVisitDate?.at(0)}
        leftIconProps={{ icon: "calendar-clock", color: nextVisitIconColor }}
      />
      <Button
        mode="contained"
        onPress={handleSave}
        isloanding={isPending}
        style={{ marginTop: 10 }}
      >
        Registrar
      </Button>
    </>
  );
}
