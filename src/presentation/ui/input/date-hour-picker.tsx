import { formatDate } from "@/src/presentation/helpers/format-date";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { ComponentProps, useMemo, useState } from "react";
import { Platform } from "react-native";
import { TextInput as TI } from "react-native-paper";
import TextInput from "./text-input";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

type Mode = "date" | "time";

dayjs.extend(utc);

const IS_ANDROID = Platform.OS === "android";

export default function NativeDateTime({
  label,
  value,
  onChange,
  error,
  leftIconProps,
}: {
  label: string;
  value?: Date | undefined | null;
  onChange?: (value: Date) => void;
  error?: string;
  leftIconProps?: ComponentProps<typeof TI.Icon>;
}) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mode, setMode] = useState<Mode>("date");
  const [show, setShow] = useState(false);
  const [dateUtc, setDateUtc] = useState(dayjs.utc());

  const getPickerDate = () => {
    const offsetInMinutes = dayjs().utcOffset();
    return dateUtc.add(offsetInMinutes, "minute").toDate();
  };

  const updatePickedDate = (selectedDate: Date) => {
    const offsetInMinutes = dayjs().utcOffset();
    const realUtcDate = dayjs(selectedDate)
      .subtract(offsetInMinutes, "minute")
      .utc();
    setDateUtc(realUtcDate);
    setDate(selectedDate);
    onChange?.(selectedDate);
  };

  const onValueChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (mode === "date") {
      setMode("time");
    } else {
      setShow(false);
      setMode("date");
    }
    if (selectedDate) {
      updatePickedDate(selectedDate);
    }
  };

  const openDatePicker = () => {
    if (IS_ANDROID) {
      DateTimePickerAndroid.open({
        mode: "date",
        value: getPickerDate(),
        is24Hour: false,
        timeZoneName: "UTC",
        onChange: (event, selectedDate) => {
          if (event.type !== "set" || !selectedDate) {
            return;
          }
          updatePickedDate(selectedDate);
          DateTimePickerAndroid.open({
            mode: "time",
            value: selectedDate,
            is24Hour: false,
            timeZoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
            onChange: (event2, selectedTime) => {
              if (event2.type !== "set" || !selectedTime) {
                return;
              }
              updatePickedDate(selectedTime);
            },
          });
        },
      });
      return;
    }
    setMode("date");
    setShow(true);
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
        leftIconProps={leftIconProps ?? { icon: "calendar" }}
        onTouchStart={openDatePicker}
        error={error}
      />

      {!IS_ANDROID && show && (
        <DateTimePicker
          value={getPickerDate()}
          mode={mode}
          is24Hour={false}
          onChange={onValueChange}
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
