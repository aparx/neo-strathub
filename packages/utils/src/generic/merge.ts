import { nonNull } from "./nonNull";
import { Nullish } from "./types";

export function mergeClassNames(...names: Nullish<string>[]) {
  return names.filter(nonNull).join(" ");
}
