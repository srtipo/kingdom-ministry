import { IVisitsRepository } from "../interfaces/visit.interface";

export class GetVisitDetailsHandler {
  private repository: IVisitsRepository;
  constructor(repository: IVisitsRepository) {
    this.repository = repository;
  }

  async execute(id: string) {
    const visit = await this.repository.getById(id);
    if (!visit) {
      throw new Error("Visit not found");
    }
    return visit;
  }
}
