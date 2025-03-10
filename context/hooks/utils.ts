export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: num > 9999 ? "compact" : "standard"
  }).format(num);
}