import { SegmentedButton } from "@/src/presentation/ui/buttons/segmented-button";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { useContext, useState } from "react";

import {
  ICreateVisit,
  VisitTypeEnum,
} from "@/src/core/modules/visits/interfaces/visit.interface";
import { PHONE_REGEX } from "@/src/presentation/constants/phoneRegex";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import useZodValidator from "@/src/presentation/hooks/use-zod-validator";
import { z } from "@/src/presentation/libraries/zod";
import { Icon } from "@/src/presentation/ui/icons/icon";
import NativeDateTime from "@/src/presentation/ui/input/date-hour-picker";
import TextInput from "@/src/presentation/ui/input/text-input";
import { SnackBarContext } from "@/src/presentation/ui/snackbars/snackbar";
import { Text } from "@/src/presentation/ui/texts/text";
import useCreateVisit from "../hooks/use-create-visit";

const visitSchema = z.object({
  name: z
    .string("Debe elegir un nombre")
    .max(50, "Máximo 50 caracteres")
    .trim()
    .min(1, "EL nombre no pueder estar vacio"),
  address: z
    .string("Debe elegir una dirección")
    .max(100, "Máximo 100 caracteres")
    .trim()
    .min(1, "La dirección no puede estar vacía"),
  phone: z
    .string()
    .regex(PHONE_REGEX, "El formato del número de teléfono es incorrecto")
    .nullable()
    .optional(),
  notes: z.string().optional().nullable(),
  type: z.enum([VisitTypeEnum.visit, VisitTypeEnum.course]),
  next_visit: z
    .date("Indica la fecha de la próxima visita")
    .min(1, "Indica la fecha de la próxima visita"),
});

export default function CreateVisitForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { showSnackbar } = useContext(SnackBarContext);
  const { createVisit, isPending } = useCreateVisit({
    onSuccess: () => {
      showSnackbar.success(
        `${form.type === VisitTypeEnum.visit ? "Revisita creada" : "Curso creado"} correctamente`,
      );
      onSuccess?.();
    },
    onError: () => {
      showSnackbar.error(
        `Error al crear ${form.type === VisitTypeEnum.visit ? "la Revisita" : "el Curso"}`,
      );
    },
  });
  const color = useThemeColor();

  const [form, setForm] = useState<{
    name: string | null;
    type: VisitTypeEnum;
    address: string | null;
    phone: string | null;
    nextVisit: string | null;
    notes: string | null;
  }>({
    name: null,
    type: VisitTypeEnum.visit,
    address: null,
    phone: null,
    nextVisit: null,
    notes: null,
  });
  const { validate, errors, validateField } = useZodValidator(visitSchema);
  const handleSave = () => {
    const result = validate(form);
    if (result.success && result.data) {
      const { next_visit, ...rest } = result.data as Record<string, unknown>;
      createVisit({
        ...rest,
        nextVisit: next_visit as Date,
        lastVisit: new Date(),
      } as Omit<ICreateVisit, "createdAt" | "updatedAt">);
    }
  };

  const handleChangeText = (path: string, value: unknown) => {
    setForm({ ...form, [path]: value });
    validateField(path, value);
  };
  return (
    <>
      <SegmentedButton
        buttons={[
          {
            value: VisitTypeEnum.visit,
            label: "Revisita",
            icon: () => <Icon type="book-open" size={25} />,
            style: { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
            uncheckedColor: color.onSurfaceVariant,
          },
          {
            value: VisitTypeEnum.course,
            label: "Curso",
            icon: () => <Icon type="home-map-marker" size={25} />,
            style: { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
            uncheckedColor: color.onSurfaceVariant,
          },
        ]}
        value={form.type}
        onValueChange={(v: string) => handleChangeText("type", v)}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Nombre"
        onChangeText={(name) => handleChangeText("name", name)}
        error={errors?.name?.at(0)}
        leftIconProps={{ icon: "account-circle" }}
        borderRadius={10}
        keyboardType="name-phone-pad"
      />
      <TextInput
        label="Dirección"
        onChangeText={(address) => handleChangeText("address", address)}
        error={errors?.address?.at(0)}
        leftIconProps={{ icon: "map-marker" }}
      />
      <TextInput
        label="Teléfono"
        onChangeText={(phone) => handleChangeText("phone", phone)}
        error={errors?.phone?.at(0)}
        keyboardType="phone-pad"
        leftIconProps={{ icon: "phone" }}
      />
      <NativeDateTime
        label="Próxima visita"
        value={form.nextVisit ? new Date(form.nextVisit) : undefined}
        error={errors?.nextVisit?.at(0)}
        onChange={(val) => handleChangeText("nextVisit", val)}
      />
      <TextInput
        label="Notas"
        onChangeText={(notes) => handleChangeText("notes", notes)}
        error={errors?.notes?.at(0)}
        multiline
        leftIconProps={{ icon: "note" }}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={{ marginTop: 10 }}
        isloanding={isPending}
      >
        <Text>Crear </Text>
      </Button>
    </>
  );
}
