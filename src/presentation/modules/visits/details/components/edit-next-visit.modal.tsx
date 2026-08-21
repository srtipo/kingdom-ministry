import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";
import { Modal } from "@/src/presentation/ui/modal/modal";
import EditNextVisitForm from "./edit-next-visit.form";

export default function EditNextVisitModal({
  visit,
  isVisible,
  onCloseModal,
}: {
  visit: IVisit;
  isVisible: boolean;
  onCloseModal: () => void;
}) {
  return (
    <Modal
      isVisible={isVisible}
      onClose={onCloseModal}
      title="Editar próxima visita"
    >
      <EditNextVisitForm visit={visit} onSuccess={onCloseModal} />
    </Modal>
  );
}