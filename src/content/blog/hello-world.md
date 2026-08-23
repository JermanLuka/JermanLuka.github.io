---
title: Building this site from scratch
date: 2026-08-22
summary: Notes on setting up Astro, Tailwind and GitHub Pages without reaching for a template.
tags: ['Astro', 'Tailwind', 'GitHub Pages', 'Cloudflare']
---

First post. This site is the first public thing I have built and shipped end to
end, so I wrote down the parts that were not obvious.

## Static hosting is simpler than it sounds

There is no server. A GitHub Actions runner builds the site into a folder of
HTML files, uploads that folder, and GitHub serves it from a CDN. Nothing is
executing when you load the page - the work already happened, once, at build
time.

The trade-off is that anything dynamic needs a third-party service or a
different host.

## Styling without a config file

Tailwind 4 does not want a `tailwind.config.js`. It installs as a Vite plugin
and everything else happens in CSS: one `@import "tailwindcss"` at the top of a
single stylesheet, and plugins are pulled in with `@plugin` lines rather than
being listed in JavaScript. That caught me out because every tutorial older than
about a year tells you to create a config file first.

The one plugin I did need is `@tailwindcss/typography`. Tailwind's reset strips
the styling off every element, which is correct for building a page out of
utility classes and wrong for HTML compiled from markdown - without it, headings
in a post look identical to paragraphs.

## The domain

The site started on the free `github.io` address and moved to
[lukajerman.dev](https://lukajerman.dev), registered through Cloudflare with DNS
pointed at GitHub Pages.

Two things there were worth learning the hard way.

**A `.dev` domain is on the HSTS preload list.** Browsers refuse to load it over
plain HTTP - not "warn about", refuse. So between pointing the DNS and GitHub
finishing its certificate, the site is not slow or insecure, it is simply
unreachable. That is expected rather than broken, but it does not feel that way
while you are watching it.

**Leave Cloudflare's proxy off, at least at first.** With the orange cloud
enabled and SSL/TLS set to "Flexible", Cloudflare talks to the origin over HTTP
while telling the browser the connection is HTTPS, GitHub redirects to HTTPS, and
the two of them loop forever. It also stops GitHub from validating the domain in
the first place, so the certificate never gets issued. DNS-only until the
certificate exists; the proxy can go on afterwards, paired with SSL/TLS set to
Full (strict).

Cloudflare handles the mail too. The address on my contact page is a forwarding
alias rather than a mailbox, so my personal address is not sitting on a public
page waiting to be scraped. If the alias ever fills with spam, deleting it and
making another is the whole fix.

## Things that caught me out

- The Actions runner defaults to Node 20, which Astro rejects. Pinning
  `node-version: 22` on the build step fixed it.
- Naming the repo `JermanLuka.github.io` instead of `personal-site` meant the
  site serves from the root, so no `base` path to configure.
- A YAML value containing a colon has to be quoted. A post summary with a colon
  in the middle of it fails the build with a parser error pointing at the
  character, which is clearer than most error messages but still surprising the
  first time.

More to come as I actually build the thing out.
