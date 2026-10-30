// A Cloudflare Email Routing alias, not a real mailbox. It forwards to my
// personal inbox, which never appears on the site. If it ever attracts too much
// spam, deleting the alias and creating another one is the whole fix.
export const email = 'hi@lukajerman.dev';

/**
 * Where the contact form posts: the Cloudflare Worker in worker/. While
 * developing, start it locally with `npm run dev` inside that folder.
 */
export const contactEndpoint = import.meta.env.DEV
  ? 'http://127.0.0.1:8787'
  : 'https://contact.lukajerman.dev';

/**
 * Turnstile's public half; the secret half lives in the Worker. In
 * development it's Cloudflare's test key, which always passes. Until the
 * production key is filled in, the contact page leaves the form out.
 */
export const turnstileSiteKey = import.meta.env.DEV
  ? '1x00000000000000000000AA'
  : '';
