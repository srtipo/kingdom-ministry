export enum VisitTypeEnum {
  visit = "visit",
  course = "course",
}
export interface IVisitModel {
  id: string;
  name: string;
  address: string;
  phone?: string | undefined;
  nextVisit: string;
  lastVisit?: string | undefined;
  type: VisitTypeEnum;
  created_at: string;
  updated_at: string;
  notes?: string | undefined;
  last_visit: Date | string | undefined;
  next_visit: Date | string;
}

export interface ICreateVisit {
  name: string;
  address: string;
  phone?: string | undefined;
  next_visit: Date;
  last_visit?: Date | undefined;
  type: VisitTypeEnum;
  created_at: string;
  updated_at: string;
  notes?: string | undefined;
}

export interface IVisitDetail {
  id: string;
  name: string;
  address: string;
  phone?: string | undefined;
  last_visit: string;
  next_visit: string;
  type: VisitTypeEnum;
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
  getById: (id: string) => Promise<IVisitDetail | null>;
}
