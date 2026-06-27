import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { VisitTypeEnum } from "@/src/core/modules/visits/interfaces/visit-model.interface";

export function useGetVisitColor(visitType: VisitTypeEnum) {
  const colors = useThemeColor();
  switch (visitType) {
    case VisitTypeEnum.visit:
      return {
        backgroundColor: colors.visitType.visit,
        textColor: colors.visitType.onVisit,
      };
    case VisitTypeEnum.course:
      return {
        backgroundColor: colors.visitType.course,
        textColor: colors.visitType.onCourse,
      };
    default:
      return {
        backgroundColor: colors.visitType.visit,
        textColor: colors.visitType.onVisit,
      };
  }
}
