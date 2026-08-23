import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Both collections read straight from a folder: drop a .md file in and it is
// picked up. The schema validates frontmatter at build time, so a typo in a
// field name fails the build instead of silently rendering nothing.

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    /**
     * Name of an ongoing series this post belongs to, e.g. a devlog. Posts
     * carrying the same name are linked together automatically.
     */
    series: z.string().optional(),
    /** Which instalment this is. Required whenever `series` is set. */
    part: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** What state the work is in, not who it was for. */
    status: z.string(),
    /** Who it was for. Drives the first row of filter chips. */
    kind: z.enum(['client', 'personal']).default('personal'),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    repo: z.url().optional(),
    /**
     * Name of a blog series documenting this project. Matching posts are listed
     * on the project page automatically, so a new instalment is one new file.
     */
    devlog: z.string().optional(),
    /** Lower sorts first on the index page. */
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
