import {
  ICreateVisit,
  IVisitDetail,
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
    nextVisit: row.next_visit,
    lastVisit: row.last_visit ?? undefined,
    type: row.type as VisitTypeEnum,
    created_at: row.created_at,
    updated_at: row.updated_at,
    notes: row.notes ?? undefined,
    next_visit: row.next_visit,
    last_visit: row.last_visit ?? undefined,
  };
}

export function visitSqlRowsToDomain(
  rows: (VisitSqlRow | null)[],
): IVisitModel[] {
  return rows
    .map(visitSqlRowToDomain)
    .filter((row): row is IVisitModel => row !== null);
}

export function visitSqlRowToDetail(row: VisitSqlRow): IVisitDetail {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone ?? undefined,
    type: row.type as VisitTypeEnum,
    last_visit: row.last_visit ?? "",
    next_visit: row.next_visit,
    notes: row.notes ?? undefined,
  };
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
    next_visit: visit.next_visit.toISOString(),
    last_visit: visit.last_visit ? visit.last_visit.toISOString() : null,
    type: visit.type,
    created_at: visit.created_at,
    updated_at: visit.updated_at,
    notes: visit.notes ?? null,
  };
}
