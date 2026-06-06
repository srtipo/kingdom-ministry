import dayjs from "dayjs";
import { IVisitsRepository } from "../interfaces/visit-model.interface";
export class SearchVisitsHandler {
  private repository: IVisitsRepository;
  constructor(repository: IVisitsRepository) {
    this.repository = repository;
  }

  async execute(search?: string, startDate?: Date, endDate?: Date) {
    const formatedStartDate = startDate
      ? dayjs(startDate).format("YYYY-MM-DD")
      : undefined;
    const formatedEndDate = endDate
      ? dayjs(endDate).format("YYYY-MM-DD")
      : undefined;
    const visits = await this.repository.getAllOrderedByNextVisit(
      search,
      formatedStartDate
        ? dayjs(formatedStartDate).startOf("day").toDate()
        : undefined,
      formatedEndDate
        ? dayjs(formatedEndDate).endOf("day").toDate()
        : undefined,
    );

    return visits;
  }
}
