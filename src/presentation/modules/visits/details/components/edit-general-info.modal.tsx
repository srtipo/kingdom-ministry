import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";
import { Modal } from "@/src/presentation/ui/modal/modal";
import EditGeneralInfoForm from "./edit-general-info.form";

export default function EditGeneralInfoModal({
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
      title="Editar información"
    >
      <EditGeneralInfoForm visit={visit} onSuccess={onCloseModal} />
    </Modal>
  );
}
