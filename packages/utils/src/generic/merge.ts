import { Nullish, nonNull } from "@/generic";

export function mergeClassNames(...names: Nullish<string>[]) {
  return names.filter(nonNull).join(" ");
}
