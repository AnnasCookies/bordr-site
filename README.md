# bordr-site

Static landing page for [bordr.dev](https://bordr.dev), pointing visitors to [`AnnasCookies/bordr`](https://github.com/AnnasCookies/bordr).

## Structure

- `public/index.html`: single-page overview with the demonstration video recorded on `v1.1.1` (`media/demo-v2.mp4`), three core benefits, Tailscale/no-login security boundary callout, light/dark screenshot gallery, and quickstart commands. The version pill and the two release links name the current bordr release, and `package.json` carries the same version; `bun test` fails when they disagree.
- `public/styles.css`: self-hosted `IBM Plex Sans` and `IBM Plex Mono` typography and `bordr`'s light/dark colour tokens.
- `public/_headers`: Cloudflare Pages security (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`) and cache headers.
- `tests/site.test.ts`: verifies playbook requirements, asset integrity, and headers.

## Local development

```bash
bun install
bun run dev      # http://127.0.0.1:4173
bun run lint
bun test
```

## Deployment (`bordr.dev`)

Deployed on the latest Cloudflare Pages / Workers Static Assets platform via [`wrangler.jsonc`](wrangler.jsonc), with custom domains `bordr.dev` and `www.bordr.dev` bound directly:

```bash
bun run deploy
```
