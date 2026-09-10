export function formatINR(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return `₹${rounded.toLocaleString('en-IN', {
    minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}
