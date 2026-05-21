import { Button } from "@/ui/buttons/ui-button";
import { Modal } from "@/ui/modal/modal";
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
