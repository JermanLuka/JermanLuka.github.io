/** "23 August 2026" - for display. */
export function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** "2026-08-23" - for the datetime attribute machines read. */
export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
