import {
  ICreateVisit,
  IVisitsRepository,
} from "../interfaces/visit-model.interface";

export class CreateVisitsHandler {
  private repository: IVisitsRepository;
  constructor(db: IVisitsRepository) {
    this.repository = db;
  }

  async execute(visit: ICreateVisit) {
    return this.repository.create(visit);
  }
}
