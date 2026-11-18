// Search results cut titles off at about 60 characters and descriptions at
// about 155, so page titles and descriptions are written to fit inside those.
//
// The schema builders below produce JSON-LD: structured data that tells
// search engines in plain facts who the site is about and what each post is.
// Layout.astro prints whatever a page passes it as `schema`. Check the output
// with https://validator.schema.org or Google's Rich Results Test.

import { skills } from './cv';
import { github, linkedin } from './contact';

export const siteName = 'Luka Jerman';

const suffix = ` | ${siteName}`;

/**
 * "Page | Luka Jerman", or just the page name when adding the suffix would
 * push it past 60 characters and get the end cut off.
 */
export function pageTitle(name: string) {
  return name.length + suffix.length <= 60 ? name + suffix : name;
}

/** One id for me across every page, so posts can point back at the Person. */
const personId = (site: URL) => new URL('/#person', site).href;

/**
 * Who the site is about. knowsAbout is the skills list from the CV, so the
 * two can't drift apart.
 */
export function personSchema(site: URL, image: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(site),
    name: siteName,
    url: new URL('/', site).href,
    image: image.href,
    jobTitle: 'Software Engineer, Backend & Integrations',
    description:
      'Software engineer building backend services and integrations in C#, .NET, ASP.NET Core / MVC, SQL Server and Python.',
    // A region rather than a city: I live near Maribor, not in it, and the
    // exact town stays off the site.
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Maribor area',
      addressCountry: 'SI',
    },
    sameAs: [linkedin, github],
    knowsAbout: skills.flatMap((group) => group.items),
  };
}

type Post = {
  title: string;
  description: string;
  published: Date;
  tags: string[];
  url: URL;
};

/** A blog post, credited to the Person on the home page. */
export function blogPostingSchema(site: URL, post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.published.toISOString(),
    url: post.url.href,
    mainEntityOfPage: post.url.href,
    image: new URL('/og-image.jpg', site).href,
    keywords: post.tags.join(', '),
    author: { '@type': 'Person', '@id': personId(site), name: siteName, url: new URL('/', site).href },
  };
}
