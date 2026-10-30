// Receives the contact form on lukajerman.dev and emails it to me. The site is
// static files on GitHub Pages, so this Worker is the only server code there is.
//
// A message has to pass, in order: the right Origin, an empty honeypot, all
// three fields filled in sensibly, and a Turnstile spam check. Only then is it
// sent, through Email Routing, to the inbox in the CONTACT_TO secret. Reply-To
// is the visitor, so answering is just pressing reply.
import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';

/** Longest accepted value per field. Anything longer is refused, not cut. */
const limits = { name: 100, email: 254, message: 5000 };

// Loose on purpose: something@something.something, with no spaces or
// characters that could break out of an email header.
const emailPattern = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export default {
  async fetch(request, env): Promise<Response> {
    // Browsers only hand the reply to the page if this header names its origin.
    const origin = request.headers.get('Origin');
    const cors: Record<string, string> =
      origin === env.ALLOWED_ORIGIN
        ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
        : { Vary: 'Origin' };
    const reply = (status: number, body: { ok: true } | { error: string }) =>
      Response.json(body, { status, headers: cors });

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...cors,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    if (request.method !== 'POST') {
      return reply(405, { error: 'Only POST is accepted.' });
    }
    if (origin !== env.ALLOWED_ORIGIN) {
      return reply(403, { error: 'This form only works from lukajerman.dev.' });
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return reply(400, { error: "The form didn't come through. Please try again." });
    }
    const field = (key: string) => {
      const value = form.get(key);
      return typeof value === 'string' ? value.trim() : '';
    };

    // Hidden from people, so only a bot fills it in. Pretend it worked, so the
    // bot has no reason to try again.
    if (field('website')) {
      return reply(200, { ok: true });
    }

    // The name goes into the subject line, so line breaks become spaces.
    const name = field('name').replace(/\s+/g, ' ');
    const email = field('email');
    const message = field('message');

    if (!name || !email || !message) {
      return reply(400, { error: 'Please fill in your name, email and message.' });
    }
    if (name.length > limits.name || email.length > limits.email || message.length > limits.message) {
      return reply(400, { error: 'Something in the form is too long. Please shorten it.' });
    }
    if (!emailPattern.test(email)) {
      return reply(400, { error: "That email address doesn't look right." });
    }

    const ip = request.headers.get('CF-Connecting-IP');
    if (!(await passesTurnstile(field('cf-turnstile-response'), env.TURNSTILE_SECRET, ip))) {
      return reply(403, { error: "The spam check didn't pass. Please try again." });
    }

    const mail = createMimeMessage();
    mail.setSender({ name: 'lukajerman.dev', addr: env.SENDER });
    mail.setRecipient(env.CONTACT_TO);
    // The address only. mimetext writes a display name into the header as it
    // is, so a name with quotes or line breaks in it could forge headers.
    mail.setHeader('Reply-To', new Mailbox(email));
    mail.setSubject(`Message from ${name}`);
    mail.addMessage({
      contentType: 'text/plain',
      encoding: 'base64',
      data: base64Lines(`${message}\n\n${name} <${email}>`),
    });

    try {
      await env.MAILER.send(new EmailMessage(env.SENDER, env.CONTACT_TO, mail.asRaw()));
    } catch (error) {
      console.error('Sending the contact email failed', error);
      return reply(502, { error: "The message couldn't be sent. Please email me instead." });
    }

    return reply(200, { ok: true });
  },
} satisfies ExportedHandler<Env>;

/**
 * The body as base64, which mimetext expects already encoded. Raw text would
 * need every line under 998 bytes and plain ASCII to be valid email; base64
 * has neither limit, so č, ž and long paragraphs arrive intact. Lines are cut
 * at 76 characters, as the email standard asks.
 */
function base64Lines(text: string) {
  let binary = '';
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/.{76}(?=.)/g, '$&\n');
}

/** Asks Cloudflare whether the Turnstile token the form sent is genuine. */
async function passesTurnstile(token: string, secret: string, ip: string | null) {
  if (!token) return false;

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) return false;

  const result = await response.json<{ success: boolean }>();
  return result.success;
}
