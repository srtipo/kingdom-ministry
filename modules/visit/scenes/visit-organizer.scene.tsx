import { SearchBar } from "@/ui/search-bar/search-bar";
import { HeadLine } from "@/ui/texts/head-line";
import { Text } from "@/ui/texts/text";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import CreateVisitModal from "../components/create-visit.modal";
import VisitList from "../components/visit-list";
import { useGetVisits } from "../hooks/use-get-visits";

export default function VisitOrganizerScene() {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [isTyping, setIsTyping] = useState(false);

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

  const { data: visits, isLoading } = useGetVisits(debouncedSearchTerm);

  const onSearch = (text: string) => {
    setIsTyping(true);
    setInputValue(text);
  };
  const isFetching = useMemo(
    () => isTyping || isLoading,
    [isLoading, isTyping],
  );

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <HeadLine type={"medium"} fontWeight={"bold"}>
        Organizador de Revisitas
      </HeadLine>
      <Text>Gestiona tus revisitas de forma sencilla</Text>
      <View style={{ marginTop: 10 }}>
        <CreateVisitModal />
      </View>
      <View style={{ marginTop: 10 }}>
        <SearchBar
          placeholder={"Buscar por nombre o dirección"}
          value={inputValue}
          onChangeText={onSearch}
        />
      </View>

      <View style={{ marginTop: 10, flex: 1 }}>
        <VisitList visits={visits ?? []} isLoanding={isFetching} />
      </View>
    </View>
  );
}
