import {
  IVisit,
  VisitTypeEnum,
} from "@/src/core/modules/visits/interfaces/visit.interface";
import { PHONE_REGEX } from "@/src/presentation/constants/phoneRegex";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import useZodValidator from "@/src/presentation/hooks/use-zod-validator";
import { z } from "@/src/presentation/libraries/zod";
import { SegmentedButton } from "@/src/presentation/ui/buttons/segmented-button";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { Icon } from "@/src/presentation/ui/icons/icon";
import TextInput from "@/src/presentation/ui/input/text-input";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { useContext, useState } from "react";
import useUpdateVisit from "../../hooks/use-update-visit";

const editGeneralInfoSchema = z.object({
  name: z
    .string("Debe elegir un nombre")
    .max(50, "Máximo 50 caracteres")
    .trim()
    .min(1, "El nombre no puede estar vacío"),
  address: z
    .string("Debe elegir una dirección")
    .max(100, "Máximo 100 caracteres")
    .trim()
    .min(1, "La dirección no puede estar vacía"),
  phone: z
    .string()
    .regex(PHONE_REGEX, "El formato del número de teléfono es incorrecto")
    .optional(),
  notes: z.string().optional(),
  type: z.enum([VisitTypeEnum.visit, VisitTypeEnum.course]),
});

export default function EditGeneralInfoForm({
  visit,
  onSuccess,
}: {
  visit: IVisit;
  onSuccess?: () => void;
}) {
  const { showSnackbar } = useContext(SnackBarContext);
  const color = useThemeColor();

  const [form, setForm] = useState<{
    name: string;
    type: VisitTypeEnum;
    address: string;
    phone: string;
    notes: string;
  }>({
    name: visit.name,
    type: visit.type,
    address: visit.address,
    phone: visit.phone ?? "",
    notes: visit.notes ?? "",
  });

  const { validate, errors, validateField } = useZodValidator<{
    name: string;
    type: VisitTypeEnum;
    address: string;
    phone?: string;
    notes?: string;
  }>(editGeneralInfoSchema);

  const { updateVisit, isPending } = useUpdateVisit({
    onSuccess: () => {
      showSnackbar.success("Información actualizada");
      onSuccess?.();
    },
    onError: () => {
      showSnackbar.error("Error al actualizar la información");
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
    updateVisit({
      id: visit.id,
      data: {
        name: result.data.name,
        type: result.data.type,
        address: result.data.address,
        phone: result.data.phone || null,
        notes: result.data.notes || null,
      },
    });
  };

  return (
    <>
      <SegmentedButton
        buttons={[
          {
            value: VisitTypeEnum.visit,
            label: "Revisita",
            icon: () => (
              <Icon
                type="book-open"
                size={25}
                color={color.visitType.onVisit}
              />
            ),
            style: { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
            uncheckedColor: color.onSurfaceVariant,
            checkedColor: color.visitType.onVisit,
          },
          {
            value: VisitTypeEnum.course,
            label: "Curso",
            icon: () => (
              <Icon
                type="home-map-marker"
                size={25}
                color={color.visitType.onCourse}
              />
            ),
            style: { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
            uncheckedColor: color.onSurfaceVariant,
            checkedColor: color.visitType.onCourse,
          },
        ]}
        value={form.type}
        onValueChange={(value: string) => handleChangeText("type", value)}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Nombre"
        value={form.name}
        onChangeText={(name) => handleChangeText("name", name)}
        error={errors?.name?.at(0)}
        leftIconProps={{ icon: "account-circle", color: color.primary }}
        borderRadius={10}
        keyboardType="name-phone-pad"
      />
      <TextInput
        label="Dirección"
        value={form.address}
        onChangeText={(address) => handleChangeText("address", address)}
        error={errors?.address?.at(0)}
        leftIconProps={{ icon: "map-marker", color: color.primary }}
      />
      <TextInput
        label="Teléfono"
        value={form.phone}
        onChangeText={(phone) => handleChangeText("phone", phone)}
        error={errors?.phone?.at(0)}
        keyboardType="phone-pad"
        leftIconProps={{ icon: "phone", color: color.primary }}
      />
      <TextInput
        label="Notas"
        value={form.notes}
        onChangeText={(notes) => handleChangeText("notes", notes)}
        error={errors?.notes?.at(0)}
        multiline
        leftIconProps={{ icon: "note", color: color.primary }}
      />
      <Button
        mode="contained"
        onPress={handleSave}
        style={{ marginTop: 10 }}
        isloanding={isPending}
      >
        Guardar
      </Button>
    </>
  );
}
