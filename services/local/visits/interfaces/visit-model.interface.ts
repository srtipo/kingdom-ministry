enum VisitTypeEnum {
  visit = "visit",
  course = "course",
}
export interface IVisitModel {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  nextVisit: string;
  lastVisit: string | null;
  type: VisitTypeEnum;
  created_at: string;
  updated_at: string;
  notes: string | null;
  last_visit: Date | string | undefined;
  next_visit: Date | string;
}

export interface ICreateVisit {
  name: string;
  address: string;
  phone: string | undefined;
  next_visit: Date;
  last_visit: Date | undefined;
  type: VisitTypeEnum;
  created_at: string;
  updated_at: string;
}

export interface IVisitsRepository {
  getAll: () => Promise<IVisitModel[]>;
  create: (visit: ICreateVisit) => Promise<void>;
  getAllOrderedByNextVisit: (term?: string) => Promise<IVisitModel[]>;
}
