import { formatDate } from "@/helpers/format-date";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import TextInput from "./text-input";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

type Mode = "date" | "time";

dayjs.extend(utc);

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
  const [dateUtc, setDateUtc] = useState(dayjs.utc());

  const getPickerDate = () => {
    const offsetInMinutes = dayjs().utcOffset();
    return dateUtc.add(offsetInMinutes, "minute").toDate();
  };

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
    if (selectedDate) {
      const offsetInMinutes = dayjs().utcOffset();
      const realUtcDate = dayjs(selectedDate)
        .subtract(offsetInMinutes, "minute")
        .utc();

      setDateUtc(realUtcDate);
      setDate(selectedDate);
      onChange?.(selectedDate);
    }
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
  console.log(error);

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
          value={getPickerDate()}
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
