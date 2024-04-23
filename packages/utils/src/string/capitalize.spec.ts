import { describe, expect, test } from "@jest/globals";
import { capitalize } from "./capitalize";

describe("capitalize", () => {
  test('capitalizes "Foo Bar" to be come "Foo Bar"', () => {
    return expect(capitalize("Foo Bar")).toBe("Foo Bar");
  });

  test('capitalizes "foo Bar" to be come "Foo Bar"', () => {
    return expect(capitalize("foo Bar")).toBe("Foo Bar");
  });

  test("capitalizes null to be come null", () => {
    return expect(capitalize(null)).toBeNull();
  });

  test("capitalizes undefined to be come undefined", () => {
    return expect(capitalize(undefined)).toBeUndefined();
  });
});
