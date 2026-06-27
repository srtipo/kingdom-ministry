import {
  ICreateVisit,
  IVisitModel,
  VisitTypeEnum,
} from "@/src/core/modules/visits/interfaces/visit-model.interface";

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

export function visitSqlRowToDomain(
  row: VisitSqlRow | null,
): IVisitModel | null {
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

export function visitSqlRowsToDomain(
  rows: (VisitSqlRow | null)[],
): IVisitModel[] {
  return rows
    .map(visitSqlRowToDomain)
    .filter((row): row is IVisitModel => row !== null);
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
