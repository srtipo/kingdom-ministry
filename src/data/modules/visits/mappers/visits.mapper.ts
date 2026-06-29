import {
  ICreateVisit,
  IVisit,
  VisitTypeEnum,
} from "@/src/core/modules/visits/interfaces/visit.interface";

export interface VisitSqlRow {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  next_visit: string;
  last_visit: string | null;
  type: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

export function visitSqlRowToDomain(row: VisitSqlRow | null): IVisit | null {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone ?? undefined,
    type: row.type as VisitTypeEnum,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes ?? undefined,
    nextVisit: row.next_visit,
    lastVisit: row.last_visit ?? undefined,
  };
}

export function visitSqlRowsToDomain(rows: (VisitSqlRow | null)[]): IVisit[] {
  return rows
    .map(visitSqlRowToDomain)
    .filter((row): row is IVisit => row !== null);
}

export interface CreateVisitSqlParams {
  uuid: string;
  name: string;
  address: string;
  phone: string | null;
  next_visit: string;
  last_visit: string | null;
  type: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

export function visitDomainToSqlParams(
  data: Partial<IVisit>,
): Partial<VisitSqlRow> {
  const params: Partial<VisitSqlRow> = {};
  if (data.nextVisit !== undefined) {
    params.next_visit =
      typeof data.nextVisit === "string"
        ? data.nextVisit
        : data.nextVisit.toISOString();
  }
  if (data.lastVisit !== undefined) {
    params.last_visit = data.lastVisit
      ? typeof data.lastVisit === "string"
        ? data.lastVisit
        : data.lastVisit.toISOString()
      : null;
  }
  if (data.name !== undefined) params.name = data.name;
  if (data.address !== undefined) params.address = data.address;
  if (data.phone !== undefined) params.phone = data.phone ?? null;
  if (data.type !== undefined) params.type = data.type;
  if (data.notes !== undefined) params.notes = data.notes ?? null;
  if (data.createdAt !== undefined) params.created_at = data.createdAt;
  if (data.updatedAt !== undefined) params.updated_at = data.updatedAt;
  return params;
}

export function createVisitToSqlParams(
  visit: ICreateVisit,
  uuid: string,
): CreateVisitSqlParams {
  return {
    uuid,
    name: visit.name,
    address: visit.address,
    phone: visit.phone ?? null,
    next_visit: visit.nextVisit.toISOString(),
    last_visit: visit.lastVisit ? visit.lastVisit.toISOString() : null,
    type: visit.type,
    created_at: visit.createdAt,
    updated_at: visit.updatedAt,
    notes: visit.notes ?? null,
  };
}
