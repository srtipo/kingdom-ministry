import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import useZodValidator from "@/src/presentation/hooks/use-zod-validator";
import { z } from "@/src/presentation/libraries/zod";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import NativeDateTime from "@/src/presentation/ui/input/date-hour-picker";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { useContext, useState } from "react";
import useUpdateVisit from "../../hooks/use-update-visit";

const nextVisitSchema = z.object({
  nextVisit: z.date("Indica la fecha de la próxima visita"),
});

export default function EditNextVisitForm({
  visitId,
  currentDate,
  onSuccess,
}: {
  visitId: string;
  currentDate: Date | string;
  onSuccess?: () => void;
}) {
  const { showSnackbar } = useContext(SnackBarContext);
  const colors = useThemeColor();
  const initialDate = new Date(currentDate);
  const [nextVisit, setNextVisit] = useState<Date | null>(initialDate);

  const { validate, errors, validateField } = useZodValidator<{
    nextVisit: Date;
  }>(nextVisitSchema);

  const { updateVisit, isPending } = useUpdateVisit({
    onSuccess: () => {
      showSnackbar.success("Próxima visita actualizada");
      onSuccess?.();
    },
    onError: () => {
      showSnackbar.error("Error al actualizar la próxima visita");
    },
  });

  const handleChange = (value: Date | null) => {
    setNextVisit(value);
    validateField("nextVisit", value);
  };

  const handleSave = () => {
    const result = validate({ nextVisit });
    if (!result.success || !result.data.nextVisit) {
      showSnackbar.error("Corrige los errores antes de guardar");
      return;
    }
    updateVisit({
      id: visitId,
      data: { nextVisit: result.data.nextVisit.toISOString() },
    });
  };

  return (
    <>
      <NativeDateTime
        label="Próxima visita"
        value={nextVisit}
        onChange={(value) => handleChange(value ?? null)}
        error={errors?.nextVisit?.at(0)}
        leftIconProps={{ icon: "calendar-clock", color: colors.primary }}
      />
      <Button
        mode="contained"
        onPress={handleSave}
        isloanding={isPending}
        style={{ marginTop: 10 }}
      >
        Guardar
      </Button>
    </>
  );
}
