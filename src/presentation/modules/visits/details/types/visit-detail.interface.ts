import { VisitTypeEnum } from "../../type/visit-type.enum";

export interface IVisitDetail {
  id: string;
  name: string;
  address: string;
  phone?: string | undefined;
  notes?: string | undefined;
  type: VisitTypeEnum;
  last_visit: string;
  next_visit: string;
}
