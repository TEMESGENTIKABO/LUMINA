import { describe, it, expect } from "vitest";
import { getAllowedStatuses, canPublishDirectly, canManageAllArticles, canManageUsers } from "@/lib/admin/permissions";

describe("getAllowedStatuses", () => {
  it("restricts AUTHOR to DRAFT and IN_REVIEW only", () => {
    const allowed = getAllowedStatuses("AUTHOR" as any);
    expect(allowed).toEqual(["DRAFT", "IN_REVIEW"]);
    expect(allowed).not.toContain("PUBLISHED");
  });

  it("allows EDITOR the full status range", () => {
    const allowed = getAllowedStatuses("EDITOR" as any);
    expect(allowed).toContain("PUBLISHED");
    expect(allowed).toContain("ARCHIVED");
  });

  it("allows ADMIN the full status range", () => {
    const allowed = getAllowedStatuses("ADMIN" as any);
    expect(allowed).toContain("PUBLISHED");
  });
});

describe("canPublishDirectly", () => {
  it("returns false for AUTHOR", () => {
    expect(canPublishDirectly("AUTHOR" as any)).toBe(false);
  });
  it("returns true for EDITOR and ADMIN", () => {
    expect(canPublishDirectly("EDITOR" as any)).toBe(true);
    expect(canPublishDirectly("ADMIN" as any)).toBe(true);
  });
});

describe("canManageAllArticles", () => {
  it("returns false for AUTHOR (can only manage own articles)", () => {
    expect(canManageAllArticles("AUTHOR" as any)).toBe(false);
  });
  it("returns true for EDITOR and ADMIN", () => {
    expect(canManageAllArticles("EDITOR" as any)).toBe(true);
    expect(canManageAllArticles("ADMIN" as any)).toBe(true);
  });
});

describe("canManageUsers", () => {
  it("returns true only for ADMIN", () => {
    expect(canManageUsers("ADMIN" as any)).toBe(true);
    expect(canManageUsers("EDITOR" as any)).toBe(false);
    expect(canManageUsers("AUTHOR" as any)).toBe(false);
  });
});
