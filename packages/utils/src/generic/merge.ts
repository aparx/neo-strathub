import { nonNull } from "./nonNull";
import { Nullish } from "./types";

export function mergeClassNames(...names: Nullish<string | boolean>[]) {
  return names.filter((a) => nonNull(a) && typeof a === "string").join(" ");
}
