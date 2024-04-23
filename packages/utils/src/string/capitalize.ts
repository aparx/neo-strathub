import { Nullish } from "../generic";

type CapitalizeReturn<T extends Nullish<string>> = T extends string
  ? Capitalize<T>
  : undefined extends T
    ? undefined
    : null;

export function capitalize<const T extends Nullish<string>>(
  value: T,
): CapitalizeReturn<T> {
  if (value == null || value.length === 0) return value as any;
  if (value.length === 1) return value.toUpperCase() as any;
  return (value.charAt(0).toUpperCase() + value.substring(1)) as any;
}
