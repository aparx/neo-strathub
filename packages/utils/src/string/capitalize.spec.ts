import { describe, expect, test } from "@jest/globals";
import { capitalize } from "./capitalize";

describe("capitalize", () => {
  test("sentences", () => {
    expect(capitalize("Foo Bar")).toBe("Foo Bar");
    expect(capitalize("foo Bar")).toBe("Foo Bar");
    expect(capitalize("hEllo WorlD")).toBe("HEllo WorlD");
  });

  test("letters and whitespaces", () => {
    expect(capitalize("a")).toBe("A");
    expect(capitalize("b")).toBe("B");
    expect(capitalize("")).toBe("");
    expect(capitalize(" a")).toBe(" a");
    expect(capitalize(" ")).toBe(" ");
  });

  test("null and undefined", () => {
    expect(capitalize(null)).toBeNull();
    expect(capitalize(undefined)).toBeUndefined();
  });
});
