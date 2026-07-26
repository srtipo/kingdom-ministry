import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { Modal } from "@/src/presentation/ui/modal/modal";
import { Text } from "@/src/presentation/ui/texts/text";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { View } from "react-native";

export function DeleteVisitWarningModal({
  isVisible,
  onClose,
  onConfirm,
  isLoading,
}: {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
}) {
  const colors = useThemeColor();
  const handleConfirm = () => (onConfirm ?? onClose)();
  return (
    <Modal isVisible={isVisible} onClose={onClose} title="¿Eliminar revisita?">
      <View style={{ paddingBottom: 12, gap: 12 }}>
        <Text>
          Esta acción es irreversible. La revisita y todo su historial de
          asistencia se eliminarán de forma permanente.
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <Button type="text" onPress={onClose} isloanding={isLoading}>
            Cancelar
          </Button>
          <Button
            type="contained"
            buttonColor={colors.errorContainer}
            textColor={colors.onErrorContainer}
            onPress={handleConfirm}
            isloanding={isLoading}
          >
            Eliminar
          </Button>
        </View>
      </View>
    </Modal>
  );
}
