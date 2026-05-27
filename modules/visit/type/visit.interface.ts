import { VisitTypeEnum } from "./visit-type.enum";

export interface IVisit {
  id: number;
  name: string;
  address: string;
  phone: string;
  notes: string;
  type: VisitTypeEnum;
  last_visit: Date | string | undefined;
  next_visit: Date | string;
}
