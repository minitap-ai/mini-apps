import { describe, expect, it } from "vitest";
import { familyOrderFromRow } from "./rows";

describe("familyOrderFromRow", () => {
  it("maps a realtime row", () => {
    expect(familyOrderFromRow({ $id: "r1", placed_by: "Claire", items: "2 croissants", created_at: "2026-11-03T08:00:00Z" })).toEqual({
      id: "r1",
      placedBy: "Claire",
      items: "2 croissants",
      createdAt: "2026-11-03T08:00:00Z",
    });
  });
  it("prefers the row's own id and fills defaults", () => {
    const order = familyOrderFromRow({ $id: "r1", id: "fo_1", $createdAt: "2026-11-03T09:00:00Z" });
    expect(order).toMatchObject({ id: "fo_1", placedBy: "Family member", items: "", createdAt: "2026-11-03T09:00:00Z" });
  });
  it("ignores rows without an id", () => {
    expect(familyOrderFromRow({ items: "x" })).toBeNull();
  });
});
