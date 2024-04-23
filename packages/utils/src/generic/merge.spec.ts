import { describe, expect, test } from "@jest/globals";
import { mergeClassNames } from "./merge";

describe("mergeClassNames", () => {
  test("letters", () => {
    expect(mergeClassNames("a")).toBe("a");
    expect(mergeClassNames("a", "b")).toBe("a b");
    expect(mergeClassNames("a", "b", "c")).toBe("a b c");
  });

  test("string and whitespaces", () => {
    expect(mergeClassNames(" ", "a")).toBe("  a");
    expect(mergeClassNames(" ", "a", "b")).toBe("  a b");
    expect(mergeClassNames("a", "", "b")).toBe("a b");
    expect(mergeClassNames("a", "", "b", " c")).toBe("a b  c");
    expect(mergeClassNames("foo bar", "baz")).toBe("foo bar baz");
  });

  test("strings with null", () => {
    expect(mergeClassNames(null)).toBe("");
    expect(mergeClassNames(undefined)).toBe("");
    expect(mergeClassNames("a", null)).toBe("a");
    expect(mergeClassNames("a", undefined)).toBe("a");
    expect(mergeClassNames("a", null, "b")).toBe("a b");
    expect(mergeClassNames("a", undefined, "b")).toBe("a b");
    expect(mergeClassNames("a", undefined, null)).toBe("a");
    expect(mergeClassNames(null, "a", null)).toBe("a");
  });
});
