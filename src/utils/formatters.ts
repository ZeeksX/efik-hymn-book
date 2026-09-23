/**
 * Format a hymn number to padded string, e.g., 42 -> "042", 7 -> "007" or "07"
 */
export function formatHymnNumber(num: number, padLength: number = 3): string {
  return String(num).padStart(padLength, '0');
}

/**
 * Remove special accents and normalize for search
 */
export function normalizeEfikText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    // Keep standard letters, normalize diacritics
    .replace(/[\u0300-\u036f]/g, '')
    // map special Efik characters to base for flexible searching
    .replace(/ñ/g, 'n')
    .replace(/ọ/g, 'o')
    .replace(/ẹ/g, 'e')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Pluralize or format hymns count
 */
export function formatHymnCount(count: number): string {
  return `${count} ${count === 1 ? 'hymn' : 'hymns'}`;
}
