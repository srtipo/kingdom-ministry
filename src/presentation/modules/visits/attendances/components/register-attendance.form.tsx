import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import useZodValidator from "@/src/presentation/hooks/use-zod-validator";
import { z } from "@/src/presentation/libraries/zod";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import NativeDateTime from "@/src/presentation/ui/input/date-hour-picker";
import TextInput from "@/src/presentation/ui/input/text-input";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { useContext, useState } from "react";
import useCreateAttendance from "../hooks/use-create-attendance";

const attendanceSchema = z.object({
  date: z.date("Indica la fecha de la visita"),
  nextVisitDate: z.date("Indica la fecha de la próxima visita"),
  notes: z.string().optional().nullable(),
});

export default function RegisterAttendanceForm({
  visitId,
  type = VisitTypeEnum.visit,
  onSuccess,
}: {
  visitId: string;
  type?: VisitTypeEnum;
  onSuccess?: () => void;
}) {
  const { showSnackbar } = useContext(SnackBarContext);
  const colors = useThemeColor();
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
    onSuccess: () => {
      showSnackbar.success("Visita registrada correctamente");
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
