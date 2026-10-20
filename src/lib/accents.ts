// The accent colours a visitor can pick from the menu in the header, in the
// order the menu lists them. Each one except the default has a matching
// [data-accent="..."] block in src/styles/global.css with its colour values.

export const accents = [
  { id: 'blue', label: 'Blue', swatch: 'oklch(62.3% 0.214 259.815)' },
  { id: 'red', label: 'Red', swatch: 'oklch(63.7% 0.237 25.331)' },
  { id: 'green', label: 'Green', swatch: 'oklch(69.6% 0.17 162.48)' },
  { id: 'purple', label: '.NET purple', swatch: '#512bd4' },
] as const;

export type AccentId = (typeof accents)[number]['id'];

/** Shown to anyone who has not picked. Its colours live in @theme, so it needs no attribute. */
export const defaultAccent: AccentId = 'red';
