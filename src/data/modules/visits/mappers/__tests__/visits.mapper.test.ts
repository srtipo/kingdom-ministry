import { visitDomainToSqlParams } from "../visits.mapper";

describe("visitDomainToSqlParams", () => {
  it("should convert nextVisit Date to next_visit ISO string", () => {
    const date = new Date("2025-06-15T10:00:00.000Z");
    const result = visitDomainToSqlParams({ nextVisit: date });

    expect(result.next_visit).toBe("2025-06-15T10:00:00.000Z");
  });

  it("should keep nextVisit as string when already a string", () => {
    const result = visitDomainToSqlParams({
      nextVisit: "2025-06-15T10:00:00.000Z",
    });

    expect(result.next_visit).toBe("2025-06-15T10:00:00.000Z");
  });

  it("should convert lastVisit Date to last_visit ISO string", () => {
    const date = new Date("2025-06-01T10:00:00.000Z");
    const result = visitDomainToSqlParams({ lastVisit: date });

    expect(result.last_visit).toBe("2025-06-01T10:00:00.000Z");
  });

  it("should set last_visit to undefined when lastVisit is undefined", () => {
    const result = visitDomainToSqlParams({ lastVisit: undefined });

    expect(result.last_visit).toBeUndefined();
  });

  it("should convert name, address, phone, type, notes", () => {
    const result = visitDomainToSqlParams({
      name: "John Doe",
      address: "123 Main St",
      phone: "555-0100",
      type: "visit" as any,
      notes: "Some notes",
    });

    expect(result.name).toBe("John Doe");
    expect(result.address).toBe("123 Main St");
    expect(result.phone).toBe("555-0100");
    expect(result.type).toBe("visit");
    expect(result.notes).toBe("Some notes");
  });

  it("should not include phone when undefined", () => {
    const result = visitDomainToSqlParams({ phone: undefined });

    expect(result.phone).toBeUndefined();
  });

  it("should not include notes when undefined", () => {
    const result = visitDomainToSqlParams({ notes: undefined });

    expect(result.notes).toBeUndefined();
  });

  it("should only include defined fields", () => {
    const result = visitDomainToSqlParams({ name: "Test" });

    expect(result.name).toBe("Test");
    expect(result.next_visit).toBeUndefined();
    expect(result.last_visit).toBeUndefined();
    expect(result.address).toBeUndefined();
    expect(result.phone).toBeUndefined();
    expect(result.type).toBeUndefined();
    expect(result.notes).toBeUndefined();
  });

  it("should return empty object when no fields are provided", () => {
    const result = visitDomainToSqlParams({});

    expect(result).toEqual({});
  });
});
