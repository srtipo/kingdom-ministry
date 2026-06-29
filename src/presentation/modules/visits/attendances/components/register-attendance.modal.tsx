import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { Modal } from "@/src/presentation/ui/modal/modal";
import { visitTypeTranslation } from "../../constants/visit-type-translation";
import RegisterAttendanceForm from "./register-attendance.form";

export default function RegisterAttendanceModal({
  visitId,
  type = VisitTypeEnum.visit,
  isVisible,
  onCloseModal,
}: {
  visitId: string;
  type?: VisitTypeEnum;
  isVisible: boolean;
  onCloseModal: () => void;
}) {
  return (
    <>
      <Modal
        isVisible={isVisible}
        onClose={onCloseModal}
        title={`Registrar ${visitTypeTranslation[type]}`}
      >
        <RegisterAttendanceForm visitId={visitId} onSuccess={onCloseModal} />
      </Modal>
    </>
  );
}
