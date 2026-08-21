import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { useState } from "react";
import { visitTypeTranslation } from "../../constants/visit-type-translation";
import RegisterAttendanceModal from "./register-attendance.modal";

export function RegisterAttendanceButton({
  type = VisitTypeEnum.visit,
  visitId,
  name,
  style,
}: {
  type?: VisitTypeEnum;
  visitId: string;
  name: string;
  style?: any;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const closeModal = () => setIsVisible(false);
  const openModal = () => setIsVisible(true);
  return (
    <>
      <Button
        icon={"plus"}
        type={"contained"}
        height={40}
        onPress={openModal}
        style={style}
      >
        {`Registrar ${visitTypeTranslation[type]}`}
      </Button>
      <RegisterAttendanceModal
        visitId={visitId}
        name={name}
        type={type}
        isVisible={isVisible}
        onCloseModal={closeModal}
      />
    </>
  );
}
