import { Nullish } from "../generic";

type PascalCaseReturn<T> = null extends T
  ? null
  : undefined extends T
    ? undefined
    : T extends string
      ? string
      : never;

export function pascalCase<T extends Nullish<string>>(
  value: T,
): PascalCaseReturn<T> {
  if (!value?.length) return value as any;
  let result = "";
  let beginWord = true;
  const whitespacePattern = /\s/;
  for (let i = 0; i < value.length; ++i) {
    const char = value.charAt(i);
    if (whitespacePattern.test(char)) {
      beginWord = true;
    } else if (beginWord) {
      result += char.toUpperCase();
      beginWord = false;
      continue;
    }
    result += char;
  }
  return result as any;
}
