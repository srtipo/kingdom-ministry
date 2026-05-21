import TextInput from "@/ui/input/text-input";
import React, { useState } from "react";
import { DatePickerModal, registerTranslation } from "react-native-paper-dates";

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
  label?: string;
  value?: string | undefined | null;
  onChange: (value?: string) => void;
  locale?: string;
  error?: string;
};

export default function DatePicker({
  label,
  value,
  error,
  onChange,
  locale = "es",
}: Props) {
  const [visible, setVisible] = useState(false);

  const selectedDate = value ? new Date(value) : undefined;

  const handleConfirm = (params: any) => {
    let dateObj: Date | undefined;
    if (params && params.date instanceof Date) {
      dateObj = params.date;
    } else if (params && params.startDate) {
      const sd = params.startDate as any;
      if (
        typeof sd.year === "number" &&
        typeof sd.month === "number" &&
        typeof sd.day === "number"
      ) {
        dateObj = new Date(sd.year, sd.month - 1, sd.day);
      }
    }

    if (dateObj) {
      onChange(dateObj.toISOString());
    }
    setVisible(false);
  };

  return (
    <>
      <TextInput
        label={label}
        value={selectedDate ? selectedDate.toLocaleDateString(locale) : ""}
        onChangeText={() => {}}
        leftIconProps={{ icon: "calendar" }}
        showSoftInputOnFocus={false}
        onFocus={() => setVisible(true)}
        error={error}
      />
      <DatePickerModal
        locale={locale}
        mode="single"
        visible={visible}
        onDismiss={() => setVisible(false)}
        date={selectedDate}
        onConfirm={handleConfirm}
      />
    </>
  );
}
