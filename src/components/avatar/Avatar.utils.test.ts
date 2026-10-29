import { describe, expect, it } from "vitest";
import { getInitials } from "./Avatar.utils";

describe("getInitials", () => {
  it("uses the first letters of the first and last words", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
    expect(getInitials("Ada King Lovelace")).toBe("AL");
  });

  it("uses a single letter for a single word", () => {
    expect(getInitials("ada")).toBe("A");
  });

  it("ignores surrounding and repeated whitespace", () => {
    expect(getInitials("  ada   lovelace ")).toBe("AL");
  });

  it("returns an empty string for a blank name", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });

  it("keeps a leading emoji whole instead of splitting it", () => {
    expect(getInitials("🦊 Fox")).toBe("🦊F");
  });
});
