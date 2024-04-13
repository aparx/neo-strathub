export function calculateProgress(value: number, max: number, min: number = 0) {
  return Math.round(100 * (value / (max - min)));
}