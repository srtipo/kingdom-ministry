import {
  ICreateVisit,
  IVisitsRepository,
} from "../interfaces/visit-model.interface";

export class CreateVisitsHandler {
  private repository: IVisitsRepository;
  constructor(db: IVisitsRepository) {
    this.repository = db;
  }

  async execute(visit: Omit<ICreateVisit, "created_at" | "updated_at">) {
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    return this.repository.create({ ...visit, created_at, updated_at });
  }
}
