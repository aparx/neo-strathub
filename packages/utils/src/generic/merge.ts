import React from "react";
import { nonNull } from "./nonNull";
import { Nullish } from "./types";

export function mergeClassNames(...names: Nullish<string | boolean>[]) {
  return names
    .filter((a) => nonNull(a) && typeof a === "string" && a.length)
    .join(" ");
}

export function mergeRefs<T>(
  ...refs: Nullish<React.MutableRefObject<T | null>>[]
): React.RefCallback<T> {
  return (node) => refs.forEach((ref) => ref && (ref.current = node));
}
