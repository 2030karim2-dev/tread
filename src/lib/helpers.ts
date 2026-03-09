/**
 * Generate a simple unique ID (will be replaced by DB UUIDs later)
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Calculate percentage safely
 */
export function safePercent(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Format a number with locale-aware separators
 */
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
}
