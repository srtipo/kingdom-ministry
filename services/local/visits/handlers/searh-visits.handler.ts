import { IVisitsRepository } from "../interfaces/visit-model.interface";

export class SearchVisitsHandler {
  private repository: IVisitsRepository;
  constructor(repository: IVisitsRepository) {
    this.repository = repository;
  }

  async execute(search?: string) {
    const visits = await this.repository.getAllOrderedByNextVisit(search);
    return visits;
  }
}
