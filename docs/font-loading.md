# Font loading

Anton and Inter remain self-hosted through the existing Fontsource packages.
`src/styles/fonts.css` serves only WOFF2 Latin and Latin Extended subsets. Latin
Extended preserves Slovenian characters and loads on demand via `unicode-range`.
Anton has one weight; Inter uses one variable file per subset for all its weights.

The shared layout preloads just the two Latin files used above the fold. Vite's
`?url` imports resolve to the same content-hashed assets used by the CSS. Keep
`crossorigin="anonymous"` even though the fonts are on the same origin, so the
browser can reuse each preload for its font request.

`font-display: swap` keeps text readable while fonts arrive. Adjusted local
Impact and Arial fallbacks reduce differences in text width and line metrics.
They are temporary fallbacks: Anton and Inter always replace them when loaded.
Preloading cannot guarantee a completely invisible swap on a slow first visit.

## Production caching

The site deploys to GitHub Pages behind Cloudflare. Vite gives the font files
content-hashed URLs under `/_astro/`, so a changed file receives a new URL.

A live header check on 2026-10-21 returned `Cache-Control: no-store, max-age=600`
for both Latin font files. The `no-store` directive prevents browser storage,
even though the response also has `max-age`. This must be resolved at the
hosting/CDN layer; a static CSS file or GitHub Pages `_headers` file cannot set
HTTP response headers.

At the layer adding `no-store`, remove that directive for font responses and
set this browser-facing header for content-hashed font files only:

```
Cache-Control: public, max-age=31536000, immutable
```

For Cloudflare, scope the rule to the `lukajerman.dev` hostname, the `/_astro/`
path prefix, and `.woff2` suffix. Depending on the account's enabled features,
use a browser cache rule that overrides the origin or a response-header rule.
Check the final HTTP response: changing an edge cache TTL alone does not fix a
browser-facing `no-store` directive. Do not apply a year-long policy to HTML.

The CDN/account configuration is outside this repository. No production
cache rule or deployment was changed as part of the source update.

## Verification

Run `npm run build`, then check the generated HTML has exactly two font preloads
and that their URLs match the CSS font URLs. The build should contain four
WOFF2 files and no WOFF font files. In browser DevTools, use an empty cache and
mobile throttling, and confirm each preloaded Latin font downloads once, starts
early, and finishes before (or close to) the first text paint. Test a second
navigation with caching enabled after fixing the production headers. Also check
`čšž ČŠŽ` in both font families to verify the extended subsets still work.
