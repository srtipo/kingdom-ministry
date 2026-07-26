import { IVisitsRepository } from "../interfaces/visit.interface";

export class DeleteVisitHandler {
  private repository: IVisitsRepository;
  constructor(repository: IVisitsRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    const visit = await this.repository.getById(id);
    if (!visit) {
      throw new Error("Visit not found");
    }
    await this.repository.delete(id);
  }
}
