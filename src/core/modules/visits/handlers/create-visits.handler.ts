import {
  ICreateVisit,
  IVisitsRepository,
} from "../interfaces/visit.interface";

export class CreateVisitsHandler {
  private repository: IVisitsRepository;
  constructor(db: IVisitsRepository) {
    this.repository = db;
  }

  async execute(visit: Omit<ICreateVisit, "createdAt" | "updatedAt">) {
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    return this.repository.create({ ...visit, createdAt, updatedAt });
  }
}
