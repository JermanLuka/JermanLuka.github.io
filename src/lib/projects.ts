// Who a project was for, as the `kind` field in its frontmatter. One place for
// the wording, so the filter chips, cards and project pages always agree.

export const kinds = ['client', 'internal', 'personal'] as const;

export type Kind = (typeof kinds)[number];

/** Label for the filter chip on /projects. */
export const kindFilterLabel: Record<Kind, string> = {
  client: 'Client work',
  internal: 'Internal tools',
  personal: 'Personal',
};

/** Badge on a card and its page. Personal projects need none. */
export const kindBadge: Record<Kind, string | undefined> = {
  client: 'Client work',
  internal: 'Internal tool',
  personal: undefined,
};
