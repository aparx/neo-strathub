import React from "react";
import { nonNull } from "./nonNull";
import { Nullish } from "./types";

export function mergeClassNames(...names: Nullish<string | boolean>[]) {
  return names
    .filter((a) => nonNull(a) && typeof a === "string" && a.length)
    .join(" ");
}

export function mergeRefs<T>(
  ...refs: React.ForwardedRef<T>[]
): React.RefCallback<T> {
  return function _mergedRefs(node) {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    });
  };
}
