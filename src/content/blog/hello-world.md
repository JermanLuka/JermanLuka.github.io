---
title: Building this site from scratch
date: 2026-08-22
summary: "How I set up Astro, Tailwind and GitHub Pages without a template, and what caught me out."
tags: ['Astro', 'Tailwind', 'GitHub Pages', 'Cloudflare']
---

My first post. This site is the first public thing I've built and shipped end
to end. These are the parts that weren't obvious.

## Static hosting is simpler than it sounds

- There's no server.
- A GitHub Actions runner builds the site into a folder of HTML files and
  uploads it.
- GitHub serves that folder from a CDN.
- Nothing runs when you load a page. The work already happened once, at build
  time.
- The trade-off: anything dynamic needs a third-party service or a different
  host.

## Styling without a config file

- Tailwind 4 doesn't use a `tailwind.config.js`.
- It installs as a Vite plugin, and everything else happens in CSS.
- One `@import "tailwindcss"` goes at the top of a single stylesheet.
- Plugins are added with `@plugin` lines in the CSS, instead of being listed in
  JavaScript.
- That caught me out. Every tutorial older than about a year tells you to
  create a config file first.

The one plugin I did need is `@tailwindcss/typography`:

- Tailwind's reset strips the styling off every element.
- That's right for pages built from utility classes.
- It's wrong for HTML compiled from markdown. Without the plugin, headings in a
  post look the same as paragraphs.

## The domain

The site started on the free `github.io` address. It moved to
[lukajerman.dev](https://lukajerman.dev), registered through Cloudflare, with
DNS pointed at GitHub Pages.

Two things I learned the hard way.

**1. A `.dev` domain is on the HSTS preload list.**

- Browsers refuse to load it over plain HTTP. They don't warn, they refuse.
- So between pointing the DNS and GitHub finishing its certificate, the site is
  simply unreachable.
- That's expected, not broken. It doesn't feel that way while you're watching
  it.

**2. Leave Cloudflare's proxy off, at least at first.**

- With the orange cloud on and SSL/TLS set to "Flexible", Cloudflare talks to
  GitHub over HTTP but tells the browser the connection is HTTPS.
- GitHub redirects to HTTPS, and the two loop forever.
- The proxy also stops GitHub from validating the domain, so the certificate
  never gets issued.
- Use DNS only until the certificate exists. After that the proxy can go on,
  with SSL/TLS set to Full (strict).

**Email**

- Cloudflare handles the mail too.
- The address on my contact page is a forwarding alias, not a mailbox. My
  personal address isn't sitting on a public page waiting to be scraped.
- If the alias ever fills with spam, I delete it and make another. That's the
  whole fix.

## Things that caught me out

- The Actions runner defaults to Node 20, which Astro rejects. Pinning
  `node-version: 22` on the build step fixed it.
- Naming the repo `JermanLuka.github.io` instead of `personal-site` means the
  site serves from the root. No `base` path to configure.
- A YAML value with a colon in it has to be quoted. A post summary with a colon
  in the middle fails the build with a parser error pointing at the character.
  Clearer than most errors, but still surprising the first time.

More to come as I build the thing out.
