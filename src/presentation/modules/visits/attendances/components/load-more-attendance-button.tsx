import { Button } from "@/src/presentation/ui/buttons/ui-button";

export function LoadMoreAttendanceButton({
  onPress,
  isLoading,
}: {
  onPress: () => void;
  isLoading: boolean;
}) {
  return (
    <Button
      icon={"chevron-down"}
      type={"outlined"}
      height={40}
      onPress={onPress}
      isloanding={isLoading}
    >
      {"Cargar más"}
    </Button>
  );
}
