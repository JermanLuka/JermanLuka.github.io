---
title: Personal site
status: Live
kind: personal
summary: This site. Built from scratch with Astro and Tailwind, deployed to GitHub Pages with GitHub Actions, on a domain registered through Cloudflare.
tags: ['Astro', 'Tailwind', 'GitHub Actions', 'Cloudflare']
repo: https://github.com/JermanLuka/JermanLuka.github.io
order: 6
---

My first public site. I built it from scratch instead of from a template, so
I'd understand every piece of it.

## What it is

- A static site built with [Astro](https://astro.build) and styled with
  Tailwind.
- A GitHub Actions workflow builds it and deploys it to GitHub Pages on every
  push to `main`.
- No server, no database, no client-side JavaScript framework. The pages ship
  as plain HTML.
- The JavaScript is written by hand, with no framework underneath. For
  example, the tag filter on the project and blog lists, and a script that
  makes images in posts clickable.

## Content is just files

- Every project and post is a markdown file in a folder.
- Add a file and it shows up everywhere: its own page, the index, the RSS
  feed and the sitemap. Nothing else needs editing.
- Each collection has a schema that checks the frontmatter at build time. A
  missing summary or a misspelled field fails the build with a line number,
  instead of quietly rendering an empty page.
- Dates are checked and parsed as real dates.

The same idea saves manual work:

- `draft: true` hides an entry on the live site, but keeps it visible while
  I write locally.
- A post can set a `series` and a `part`. That links the parts together in
  order.
- A project that names the same series lists its posts automatically. That's
  how the devlog on my game's page builds itself.
- Tags turn into filter chips on the index pages, based on the tags the files
  actually use.

## The domain

- It started on the free `github.io` address. It now runs on
  [lukajerman.dev](https://lukajerman.dev), registered through Cloudflare.
- DNS points at GitHub Pages. GitHub issues the certificate, and Cloudflare
  doesn't proxy the traffic.
- That matters because `.dev` domains are on the HSTS preload list. Browsers
  refuse to load them over plain HTTP at all, so there's no "works but
  insecure" fallback.
- Cloudflare also handles email. The address on my contact page is an alias.
  It forwards to a personal inbox that isn't shown anywhere on the site.
- If it ever gets too much spam, I delete the alias and make a new one.
  That's the whole fix.

## What I learned

- How static hosting works: build once on a runner, upload the output, serve
  it from a CDN. Nothing is "running" the site.
- Why a repo named `username.github.io` is worth it. It serves from the root,
  so there's no `base` path to add to every link.
- How Astro splits build-time frontmatter from the markup below it.
- A schema is worth writing, even for a personal site. Most bugs I hit were
  content mistakes. The schema turned them into build failures instead of
  pages that looked subtly wrong.
- Publishing an email address has consequences. Think about it before the
  first commit, not after.

## Built with

Astro, Tailwind, GitHub Actions, GitHub Pages, Cloudflare.
