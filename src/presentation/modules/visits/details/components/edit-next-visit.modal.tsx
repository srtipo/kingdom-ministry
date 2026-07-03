import { Modal } from "@/src/presentation/ui/modal/modal";
import EditNextVisitForm from "./edit-next-visit.form";

export default function EditNextVisitModal({
  visitId,
  currentDate,
  isVisible,
  onCloseModal,
}: {
  visitId: string;
  currentDate: Date | string;
  isVisible: boolean;
  onCloseModal: () => void;
}) {
  return (
    <Modal
      isVisible={isVisible}
      onClose={onCloseModal}
      title="Editar próxima visita"
    >
      <EditNextVisitForm
        visitId={visitId}
        currentDate={currentDate}
        onSuccess={onCloseModal}
      />
    </Modal>
  );
}
