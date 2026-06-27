export enum VisitTypeEnum {
  visit = "visit",
  course = "course",
}
export interface IVisitModel {
  id: string;
  name: string;
  address: string;
  phone?: string | undefined;
  type: VisitTypeEnum;
  createdAt: string;
  updatedAt: string;
  notes?: string | undefined;
  lastVisit: Date | string | undefined;
  nextVisit: Date | string;
}

export interface ICreateVisit {
  name: string;
  address: string;
  phone?: string | undefined;
  nextVisit: Date;
  lastVisit?: Date | undefined;
  type: VisitTypeEnum;
  createdAt: string;
  updatedAt: string;
  notes?: string | undefined;
}

export interface IVisitsRepository {
  getAll: () => Promise<IVisitModel[]>;
  create: (visit: ICreateVisit) => Promise<void>;
  getAllOrderedByNextVisit: (
    term?: string,
    startDate?: Date,
    endDate?: Date,
  ) => Promise<IVisitModel[]>;
  getById: (id: string) => Promise<IVisitModel | null>;
}
