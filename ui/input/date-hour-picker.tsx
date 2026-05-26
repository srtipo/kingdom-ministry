import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import TextInput from "./text-input";

import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

type Mode = "date" | "time";

const formatDate = (date: Date | undefined | number): string => {
  return dayjs(date).format("dddd, DD/MM/YY, hh:mm A");
};

export default function NativeDateTime({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value?: Date | undefined | null;
  onChange?: (value: Date) => void;
  error?: string;
}) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mode, setMode] = useState<Mode>("date");
  const [show, setShow] = useState(false);

  const onValueChange = (
    event: DateTimePickerChangeEvent,
    selectedDate: Date,
  ) => {
    if (mode === "date") {
      setMode("time");
    } else {
      setShow(false);
      setMode("date");
    }
    setDate(selectedDate);
    onChange?.(selectedDate);
  };

  const openDatePicker = () => {
    setMode("date");
    setShow(true);
  };

  const closeDatePicker = () => {
    setShow(false);
  };
  const dateValueString = useMemo(() => {
    if (value) {
      return formatDate(value);
    }
    if (date) {
      return formatDate(date);
    }
    return "";
  }, [date, value]);

  return (
    <>
      <TextInput
        label={label}
        onChangeText={() => {}}
        value={dateValueString}
        leftIconProps={{ icon: "calendar" }}
        onTouchStart={openDatePicker}
        error={error}
      />

      {show && (
        <DateTimePicker
          locale="es"
          value={value ?? (date ? date : new Date())}
          mode={mode}
          onDismiss={closeDatePicker}
          onValueChange={onValueChange}
          design="material"
          timeZoneName={
            mode === "date"
              ? "UTC"
              : Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        />
      )}
    </>
  );
}
