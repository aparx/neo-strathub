export function formatCurrency(value: number, currency: "USD" | "EUR" = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}
