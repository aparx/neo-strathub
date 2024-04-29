export function timeCallback<TArgs extends any[], TReturn>(
  callbackFn: (...args: TArgs) => TReturn,
  label?: string,
): (...args: TArgs) => Promise<TReturn> {
  if (process.env.NODE_ENV === "production")
    // In production we skip any timing
    return async (...args: TArgs) => callbackFn(...args);
  // Actually create an anonymous timing function
  label = createLabel(label || "#" + callbackFn.name);
  return async (...args: TArgs) => {
    console.time(label);
    const result = await callbackFn(...args);
    console.timeEnd(label);
    return result;
  };
}

function createLabel(base: string): string {
  return `${base} [${Math.ceil(Math.random() * 1000)}]`;
}
