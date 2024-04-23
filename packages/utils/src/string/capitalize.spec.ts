import { describe, expect, test } from "@jest/globals";
import { capitalize } from "./capitalize";

describe("capitalize", () => {
  test('capitalizes "Foo Bar" to be come "Foo Bar"', () => {
    expect(capitalize("Foo Bar")).toBe("Foo Bar");
  });

  test('capitalizes "foo Bar" to be come "Foo Bar"', () => {
    expect(capitalize("foo Bar")).toBe("Foo Bar");
  });

  test("capitalizes null to be come null", () => {
    expect(capitalize(null)).toBeNull();
  });

  test("capitalizes undefined to be come undefined", () => {
    expect(capitalize(undefined)).toBeUndefined();
  });
});
