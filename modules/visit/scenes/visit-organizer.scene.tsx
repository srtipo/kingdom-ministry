import { SearchBar } from "@/ui/search-bar/search-bar";
import { HeadLine } from "@/ui/texts/head-line";
import { Text } from "@/ui/texts/text";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import CreateVisitModal from "../components/create-visit.modal";
import {
  DateSelectionEnum,
  VisitDateSelection,
} from "../components/visit-date-selection";
import VisitList from "../components/visit-list";
import { useGetVisits } from "../hooks/use-get-visits";

export default function VisitOrganizerScene() {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [dateSelection, setDateSelection] = useState<DateSelectionEnum>(
    DateSelectionEnum.Today,
  );
  const [dates, setDates] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: dayjs().toDate(),
    endDate: dayjs().toDate(),
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<
    string | undefined
  >(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(inputValue);
      setIsTyping(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [inputValue]);

  const {
    data: visits,

    isFetching,
  } = useGetVisits(debouncedSearchTerm, dates);

  const onSearch = (text: string) => {
    setIsTyping(true);
    setInputValue(text);
  };
  const isLoading = useMemo(
    () => (isTyping || isFetching ? true : false),
    [isFetching, isTyping],
  );
  const personalizedLabel = useMemo(() => {
    if (
      dates.startDate &&
      dates.endDate &&
      dateSelection === DateSelectionEnum.Personalized
    ) {
      return `${dayjs(dates.startDate).format(
        "DD/MM/YYYY",
      )} - ${dayjs(dates.endDate).format("DD/MM/YYYY")}`;
    }
    return "Personalizado";
  }, [dates, dateSelection]);
  const onDateSelectionChange = ({
    startDate,
    endDate,
    value,
  }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    value: DateSelectionEnum;
  }) => {
    setDates({ startDate, endDate });
    setDateSelection(value);
  };

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <HeadLine type={"medium"} fontWeight={"bold"}>
        Organizador de Revisitas
      </HeadLine>
      <Text>Gestiona tus revisitas de forma sencilla</Text>
      <View style={{ marginBlock: 5 }}>
        <CreateVisitModal />
      </View>
      <View style={{ marginBlock: 5 }}>
        <SearchBar
          placeholder={"Buscar por nombre o dirección"}
          value={inputValue}
          onChangeText={onSearch}
        />
      </View>
      <View style={{ display: "flex", height: 40, marginBlock: 5 }}>
        <VisitDateSelection
          onChange={onDateSelectionChange}
          value={dateSelection}
          dafaultValue={"Today"}
          personalizedLabel={personalizedLabel}
        />
      </View>

      <View style={{ marginTop: 5, flex: 1 }}>
        <VisitList visits={visits ?? []} isLoanding={isLoading} />
      </View>
    </View>
  );
}
