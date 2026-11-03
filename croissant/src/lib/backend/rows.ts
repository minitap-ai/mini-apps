import type { FamilyOrder } from "./types";

export interface FamilyOrderRow {
  $id?: string;
  id?: string;
  placed_by?: string;
  items?: string;
  created_at?: string;
  $createdAt?: string;
}

export function familyOrderFromRow(row: FamilyOrderRow): FamilyOrder | null {
  const id = row.id ?? row.$id;
  if (!id) return null;
  return {
    id,
    placedBy: row.placed_by ?? "Family member",
    items: row.items ?? "",
    createdAt: row.created_at ?? row.$createdAt ?? new Date().toISOString(),
  };
}
