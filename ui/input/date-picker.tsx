import React, { useCallback, useState } from "react";
import { DatePickerModal, registerTranslation } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

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
  onChange: ({
    startDate,
    endDate,
  }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
  isVisible: boolean;

  onDismiss?: () => void;
};

export function DatePicker({ onChange, isVisible, onDismiss }: Props) {
  const [range, setRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const onConfirm = useCallback(
    ({
      startDate,
      endDate,
    }: {
      startDate: CalendarDate;
      endDate: CalendarDate;
    }) => {
      setRange({ startDate, endDate });
      onChange({ startDate, endDate });
    },
    [setRange, onChange],
  );

  return (
    <DatePickerModal
      locale="es"
      mode="range"
      visible={isVisible}
      onDismiss={() => onDismiss?.()}
      startDate={range.startDate}
      endDate={range.endDate}
      onConfirm={onConfirm}
    />
  );
}
