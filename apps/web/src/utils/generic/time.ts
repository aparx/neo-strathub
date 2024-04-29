export function time<R>(callbackFn: () => R, label?: string): () => Promise<R> {
  if (process.env.NODE_ENV === "production")
    // In production we skip any timing
    return async () => callbackFn();
  label = createLabel(label || "#" + callbackFn.name);
  return async () => {
    console.time(label);
    const result = await callbackFn();
    console.timeEnd(label);
    return result;
  };
}

function createLabel(base: string): string {
  return `${base} [${Math.ceil(Math.random() * 1000)}]`;
}
