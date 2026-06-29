import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { useState } from "react";
import { visitTypeTranslation } from "../../constants/visit-type-translation";
import RegisterAttendanceModal from "./register-attendance.modal";

export function RegisterAttendanceButton({
  type = VisitTypeEnum.visit,
  visitId,
}: {
  type?: VisitTypeEnum;
  visitId: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const closeModal = () => setIsVisible(false);
  const openModal = () => setIsVisible(true);
  return (
    <>
      <Button icon={"plus"} type={"contained"} height={40} onPress={openModal}>
        {`Registrar ${visitTypeTranslation[type]}`}
      </Button>
      <RegisterAttendanceModal
        visitId={visitId}
        type={type}
        isVisible={isVisible}
        onCloseModal={closeModal}
      />
    </>
  );
}
