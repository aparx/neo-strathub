import { describe, expect, test } from "@jest/globals";
import { pascalCase } from "./pascalCase";

describe("pascalCase", () => {
  test("sentences", () => {
    expect(pascalCase("hello world")).toBe("Hello World");
    expect(pascalCase("Foo bAr")).toBe("Foo BAr");
    expect(pascalCase("foo Bar baz")).toBe("Foo Bar Baz");
    expect(pascalCase("Pascal Case")).toBe("Pascal Case");
    expect(pascalCase("camelCase")).toBe("CamelCase");
    expect(pascalCase("snake_case")).toBe("Snake_case");
  });

  test("null and undefined", () => {
    expect(pascalCase(null)).toBeNull();
    expect(pascalCase(undefined)).toBeUndefined();
  });
});
