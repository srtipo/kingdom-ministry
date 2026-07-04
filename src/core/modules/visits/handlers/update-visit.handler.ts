import {
  IVisit,
  IVisitsRepository,
} from "../interfaces/visit.interface";

export class UpdateVisitHandler {
  private repository: IVisitsRepository;
  constructor(repository: IVisitsRepository) {
    this.repository = repository;
  }

  async execute(id: string, data: Partial<IVisit>): Promise<void> {
    await this.repository.update(id, data);
  }
}
