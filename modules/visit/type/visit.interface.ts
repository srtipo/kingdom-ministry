import { VisitTypeEnum } from "./visit-type.enum";

export interface IVisit {
  id: number;
  name: string;
  address: string;
  phone: string;
  notes: string;
  type: VisitTypeEnum;
  lastVisit: string;
  nextVisit: string;
}
