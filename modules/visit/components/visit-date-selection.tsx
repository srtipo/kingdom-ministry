import SegmentedButton from "@/ui/buttons/segmented-button";
import { Icon } from "@/ui/icons/icon";
import { DatePicker } from "@/ui/input/date-picker";
import dayjs from "dayjs";
import { useState } from "react";
import { ScrollView } from "react-native";
export enum DateSelectionEnum {
  Past = "past",
  Today = "hoy",
  Tomorrow = "mañana",
  NextWeek = "nextWeek",
  All = "all",
  Personalized = "personalized",
}

export function VisitDateSelection({
  onChange,
  value,
  dafaultValue,
  personalizedLabel = "Presonalizado",
}: {
  onChange?: (dates: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    value: DateSelectionEnum;
  }) => void;
  dafaultValue?: keyof typeof DateSelectionEnum;
  value?: DateSelectionEnum;
  personalizedLabel?: string;
}) {
  const [dateSelection, setDateSelection] = useState<DateSelectionEnum>(
    dafaultValue ? DateSelectionEnum[dafaultValue] : DateSelectionEnum.Today,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onDateSelectionChange = (value: DateSelectionEnum) => {
    setDateSelection(value);
    const now = dayjs();
    switch (value) {
      case DateSelectionEnum.Past:
        onChange?.({
          startDate: undefined,
          endDate: now.subtract(1, "day").endOf("day").toDate(),
          value,
        });
        break;
      case DateSelectionEnum.Today:
        setIsModalVisible(false);
        onChange?.({
          startDate: now.startOf("day").toDate(),
          endDate: now.endOf("day").toDate(),
          value,
        });
        break;
      case DateSelectionEnum.Tomorrow:
        setIsModalVisible(false);
        onChange?.({
          startDate: now.add(1, "day").startOf("day").toDate(),
          endDate: now.add(1, "day").endOf("day").toDate(),
          value,
        });
        break;
      case DateSelectionEnum.NextWeek:
        setIsModalVisible(false);
        onChange?.({
          startDate: now.add(1, "week").startOf("week").toDate(),
          endDate: now.add(1, "week").endOf("week").toDate(),
          value,
        });
        break;
      case DateSelectionEnum.All:
        setIsModalVisible(false);
        onChange?.({
          startDate: undefined,
          endDate: undefined,
          value,
        });
        break;
      case DateSelectionEnum.Personalized:
        setIsModalVisible(true);
        break;
    }
  };
  const segmentedButtons = [
    {
      value: DateSelectionEnum.Past,
      label: "Anteriores",
      style: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
      },
    },
    {
      value: DateSelectionEnum.Today,
      label: "Hoy",
    },
    {
      value: DateSelectionEnum.Tomorrow,
      label: "Mañana",
    },
    {
      value: DateSelectionEnum.NextWeek,
      label: "Próxima Semana",
    },
    {
      value: DateSelectionEnum.All,
      label: "Todos",
    },
    {
      value: DateSelectionEnum.Personalized,
      label: personalizedLabel,
      icon: () => <Icon type="calendar-clock" size={18} />,
      style: { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
    },
  ];
  return (
    <>
      <ScrollView horizontal={true}>
        <SegmentedButton
          value={value ?? dateSelection}
          buttons={segmentedButtons}
          onValueChange={(value: string) => {
            onDateSelectionChange(value as DateSelectionEnum);
          }}
        />
      </ScrollView>

      <DatePicker
        onChange={(data) => {
          onChange?.({
            ...data,
            value: dateSelection,
          });
          setIsModalVisible(false);
        }}
        isVisible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
      />
    </>
  );
}
