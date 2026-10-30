# Contact form Worker

The contact form on `/contact` posts here. The site itself is static files on
GitHub Pages and can't receive anything, so this Cloudflare Worker does it:

1. It checks the message came from `lukajerman.dev`, the hidden honeypot field
   is empty, and all three fields are filled in sensibly.
2. It asks Cloudflare Turnstile whether the visitor passed the spam check.
3. It emails the message from `form@lukajerman.dev` to my inbox through Email
   Routing, with Reply-To set to the visitor, so answering is just pressing
   reply.

It runs at `https://contact.lukajerman.dev`.

## Still to do

The code is finished and tested locally. These steps need my Cloudflare
account, so they're manual. Do them in order.

- [ ] **1. Check Email Routing**
- [ ] **2. Create the Turnstile widget**
- [ ] **3. Deploy the Worker**
- [ ] **4. Set the two secrets**
- [ ] **5. Turn the form on in the site**
- [ ] **6. Push and test it live**

### 1. Check Email Routing

The Worker can only send to an inbox that Email Routing has verified.

In the Cloudflare dashboard: **lukajerman.dev → Email → Email Routing →
Destination addresses**. My personal inbox should show **Verified**. It most
likely already does, because `hi@lukajerman.dev` forwards to it. If it isn't
there, add it and click the link in the confirmation email.

### 2. Create the Turnstile widget

Turnstile is Cloudflare's spam check. It's invisible unless it thinks a
visitor needs to click something.

In the dashboard: **Turnstile → Add widget**.

- Name: `Contact form`
- Hostname: `lukajerman.dev`
- Widget mode: **Managed**

It shows two keys. Keep both open for the next steps:

- **Site key**: public. It goes in the site's code in step 5.
- **Secret key**: private. It goes into the Worker in step 4. Never commit it.

### 3. Deploy the Worker

```powershell
cd D:\Desktop\personal_site\worker
npm install
npx wrangler login
npx wrangler deploy
```

- `login` opens the browser to connect Wrangler to my Cloudflare account.
- `deploy` should end with something like:

  ```
  Deployed contact-form triggers
    contact.lukajerman.dev (custom domain)
  ```

  Cloudflare creates the `contact` DNS record and its certificate itself. The
  certificate can take a few minutes to become active.

### 4. Set the two secrets

The secrets live in Cloudflare, not in this public repo.

```powershell
npx wrangler secret put TURNSTILE_SECRET
npx wrangler secret put CONTACT_TO
```

Each one asks for a value:

- `TURNSTILE_SECRET`: the **secret key** from step 2.
- `CONTACT_TO`: my **personal inbox address**, the verified one from step 1.

Each should answer with `✨ Success! Uploaded secret ...`.

### 5. Turn the form on in the site

In `src/lib/contact.ts`, paste the **site key** from step 2 into the empty
string in `turnstileSiteKey`:

```ts
export const turnstileSiteKey = import.meta.env.DEV
  ? '1x00000000000000000000AA'
  : 'PASTE-THE-SITE-KEY-HERE';
```

Until this is filled in, production builds leave the form off `/contact` and
show only the email, GitHub and LinkedIn links. Pushing before this step is
safe.

### 6. Push and test it live

Commit and push. Once the GitHub Action has deployed the site, open
<https://lukajerman.dev/contact>, send a test message, and check the inbox.

To watch the Worker while testing:

```powershell
npx wrangler tail
```

It prints every request and any error as it happens. Stop it with Ctrl+C.

## If something goes wrong

The message the form shows tells you where to look.

| The form says | Likely cause |
| --- | --- |
| "The spam check didn't pass" | `TURNSTILE_SECRET` is wrong, or `lukajerman.dev` isn't a hostname on the widget. |
| "This form only works from lukajerman.dev" | The page's address doesn't match `ALLOWED_ORIGIN` in `wrangler.jsonc`, for example `www.lukajerman.dev`. |
| "The message couldn't be sent" | `CONTACT_TO` isn't a verified destination address, or Email Routing is off. `npx wrangler tail` shows the exact error. |
| "Couldn't reach the server" | The Worker isn't deployed, or the `contact.lukajerman.dev` certificate isn't active yet. |

If `deploy` fails saying a DNS record already exists for
`contact.lukajerman.dev`, delete that record in the dashboard and deploy again.

## Working on it locally

```powershell
cd D:\Desktop\personal_site\worker
npm install
Copy-Item .dev.vars.example .dev.vars
npm run dev
```

Then run `npm run dev` in the project root as usual and open
<http://localhost:4321/contact>.

Locally, everything uses Cloudflare's published Turnstile test keys, which
always pass, and no real email is sent. Wrangler saves each message as an
`.eml` file under `.wrangler/tmp/email/` and prints its path.

After changing `wrangler.jsonc`, run `npm run types` to regenerate
`worker-configuration.d.ts`, then `npm run check` to type-check.
