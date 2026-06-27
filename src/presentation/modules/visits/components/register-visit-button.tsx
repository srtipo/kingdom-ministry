import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { visitTypeTranslation } from "../constants/visit-type-translation";
import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit.interface";

export function RegisterVisitButton({
  type = VisitTypeEnum.visit,
}: {
  type?: VisitTypeEnum;
}) {
  return (
    <Button
      icon={"plus"}
      type={"contained"}
      height={40}
      onClick={() => console.log("click")}
      onPress={() => console.log("click")}
    >
      {`Registrar ${visitTypeTranslation[type]}`}
    </Button>
  );
}
