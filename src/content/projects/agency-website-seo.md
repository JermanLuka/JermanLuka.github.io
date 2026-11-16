---
title: Agency website SEO
status: Live
kind: internal
summary: "SEO for the agency's own website. Mobile PageSpeed went from no score to 78, with 100 in Accessibility, Best Practices, and SEO."
tags: ['SEO', 'Search Console', 'GA4', 'PostHog', 'AI agents']
order: 4
---

Built at extra.dev, on the agency's own website. The code isn't public.

## The problem

- The website needed to show up better in Google and in AI search.
- On mobile, PageSpeed gave no score at all.

## What I did

- Led the SEO and AI search work.
- Set up Search Console, GA4 and Ahrefs.
- Shipped 6 PRs: redirects, analytics events, font and layout fixes, and
  mobile performance.
- Built a monthly SEO agent. It pulls Search Console, PostHog and other
  data, scores the site on speed and SEO metrics, and writes a plain-English
  report.
- The agent recommends up to 3 changes a month and can make the code changes
  itself. A person reviews each one before it's applied.

## Results

- Mobile PageSpeed: from no score to 78.
- 100 in Accessibility, Best Practices, and SEO.

## Built with

Google Search Console API, GA4, PostHog, Ahrefs.
