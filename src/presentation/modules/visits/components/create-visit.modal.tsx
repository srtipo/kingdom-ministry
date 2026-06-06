import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { Modal } from "@/src/presentation/ui/modal/modal";
import { useState } from "react";
import CreateVisitForm from "./create-visit.form";

export default function CreateVisitModal() {
  const [isVisible, setIsVisible] = useState(false);
  const closeModal = () => setIsVisible(false);
  const openModal = () => setIsVisible(true);
  return (
    <>
      <Button type={"contained"} icon={"plus"} onPress={openModal}>
        Nueva Revisita/Curso
      </Button>
      <Modal
        isVisible={isVisible}
        onClose={closeModal}
        title="Nueva Revisita/Curso"
      >
        <CreateVisitForm onSuccess={closeModal} />
      </Modal>
    </>
  );
}
