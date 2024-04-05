export function nonNull<T>(arg: T): arg is NonNullable<T> {
  return arg != null;
}