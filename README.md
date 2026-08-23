# jermanluka.github.io

My personal site: a CV, a project showcase, and a blog. Built from scratch rather
than from a template, because the point was to understand every piece of it.

Live at **https://jermanluka.github.io**

## Stack

- [Astro](https://astro.build) - static site generator, ships no JavaScript by default
- [Tailwind CSS](https://tailwindcss.com) v4, via `@tailwindcss/vite`
- GitHub Pages, deployed by GitHub Actions on every push to `main`

The whole site is static HTML. The only client-side JavaScript is a few hundred
bytes: the tag filter on the project and blog lists, and a script that makes
images in posts clickable.

## Running it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
npm run preview  # serve the built site
```

Requires Node 22 or newer.

## Adding content

Projects and posts are markdown files. Drop one in the right folder and it
appears on the site - no code changes.

- **A project:** `src/content/projects/<slug>.md`
- **A post:** `src/content/blog/<slug>.md`

Frontmatter is validated at build time by the schemas in `src/content.config.ts`,
so a missing or misspelled field fails the build rather than rendering wrong.
Setting `draft: true` hides an entry in production while leaving it visible in
`npm run dev`.

Posts can belong to a series with `series:` and `part:`, which links the
instalments together automatically. A project naming that same series in its
`devlog:` field lists them on its own page.

## Layout

```
src/
  components/     reusable markup (header, footer, cards, tag filter)
  content/        markdown: blog posts and projects
  layouts/        the page shell: head tags, header, footer
  lib/            CV data, skill logos, date helpers
  pages/          routes; [...slug].astro files generate one page per entry
  styles/         global.css - Tailwind entry point plus a few overrides
```
