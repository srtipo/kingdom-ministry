import { VisitTypeEnum } from "@/modules/visit/components/visit-card";

export interface IVisitModel {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  nextVisit: string | null;
  lastVisit: string | null;
  type: VisitTypeEnum;
}

export interface ICreateVisit {
  id: string;
  name: string;
  address: string;
  phone: string | undefined;
  nextVisit: string | undefined;
  lastVisit: string | undefined;
  type: VisitTypeEnum;
}

export interface IVisitsRepository {
  getAll: () => Promise<IVisitModel[]>;
  create: (visit: ICreateVisit) => Promise<void>;
}
