import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { VisitTypeEnum } from "../type/visit-type.enum";

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
  }
}
