import { formatDate } from "@/src/presentation/helpers/format-date";
import React, { ComponentProps, useState } from "react";
import { TextInput as TI } from "react-native-paper";
import { DatePickerModal, registerTranslation } from "react-native-paper-dates";
import TextInput from "./text-input";

registerTranslation("es", {
  selectSingle: "Seleccionar fecha",
  selectMultiple: "Seleccionar fechas",
  selectRange: "Seleccionar rango",
  save: "Guardar",
  notAccordingToDateFormat: (inputFormat: string) =>
    `Formato inválido, use ${inputFormat}`,
  mustBeHigherThan: (date: string) => `Debe ser posterior a ${date}`,
  mustBeLowerThan: (date: string) => `Debe ser anterior a ${date}`,
  mustBeBetween: (startDate: string, endDate: string) =>
    `Debe estar entre ${startDate} y ${endDate}`,
  dateIsDisabled: "Fecha deshabilitada",
  previous: "Anterior",
  next: "Siguiente",
  typeInDate: "Escriba la fecha",
  pickDateFromCalendar: "Seleccione la fecha del calendario",
  close: "Cerrar",
  hour: "Hora",
  minute: "Minuto",
});

type Props = {
  label: string;
  value?: Date | null | undefined;
  onChange?: (date: Date | undefined) => void;
  error?: string;
  leftIconProps?: ComponentProps<typeof TI.Icon>;
  placeholder?: string;
};

export default function DatePicker({
  label,
  value,
  onChange,
  error,
  leftIconProps,
  placeholder = "dd/mm/aaaa",
}: Props) {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <>
      <TextInput
        label={label}
        value={value ? formatDate(value, "DD/MM/YYYY") : ""}
        onChangeText={() => {}}
        placeholder={placeholder}
        leftIconProps={leftIconProps ?? { icon: "calendar" }}
        onTouchStart={open}
        error={error}
      />
      <DatePickerModal
        locale="es"
        mode="single"
        visible={visible}
        onDismiss={close}
        date={value ?? undefined}
        onConfirm={({ date }) => {
          onChange?.(date);
          close();
        }}
      />
    </>
  );
}
