import { VisitTypeEnum } from "./visit-type.enum";

export interface IVisit {
  id: string;
  name: string;
  address: string;
  phone?: string | undefined;
  notes?: string | undefined;
  type: VisitTypeEnum;
  last_visit?: Date | string | undefined;
  next_visit: Date | string;
}
