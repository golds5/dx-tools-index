# DX Tools Index

Gated showcase page for what the S5Tech **Digital Experience** department has built.

Live: <https://dx-tools-index.vercel.app> (sign-in required)

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The whole showcase page — markup, styles and scripts in one file, no build step |
| `login.html` | Sign-in form |
| `middleware.js` | Edge Middleware — gates every request except the public paths below |
| `api/login.js` | Checks the email domain + password, sets a signed session cookie |
| `api/logout.js` | Clears the cookie |
| `vercel.json` | `cleanUrls` + `noindex` / anti-framing headers |
| `*.webp` | Page assets (hero band, logos, game banners, icons, concept art) |

Public paths (no session needed): `/login`, `/api/login`, `/api/logout`, `/robots.txt`, `/favicon.ico`.
Everything else redirects to `/login` without a valid cookie.

## Environment variables

Set in Vercel — **never** in this repo.

| Name | Purpose |
| --- | --- |
| `AUTH_SECRET` | HMAC-SHA256 key that signs the session cookie |
| `AUTH_PASSWORD` | The shared sign-in password |

Sign-in also requires the email to end in `@s5tech.co`. Sessions last 12 hours;
the cookie is `HttpOnly; Secure; SameSite=Lax`.

## Local preview

The gate is Edge Middleware and does **not** run locally, so a plain static
server shows the page ungated — fine for reviewing layout, not the same as the
deployed site.

```bash
cd /tmp && python3 -c "
from http.server import HTTPServer, SimpleHTTPRequestHandler
import functools
h = functools.partial(SimpleHTTPRequestHandler, directory='/Users/hao/Developer/dx-tools-index')
HTTPServer(('127.0.0.1', 8900), h).serve_forever()
"
```

To exercise the real gate, run `vercel dev` instead.

## Deploying

Pushing to `main` deploys to production via the Vercel Git integration.
`vercel deploy --prod` still works as a manual fallback.

## House rules for edits

- The page speaks as the DX department. **No individual names.**
- Light "Liquid Glass" (macOS Tahoe) design. A dark gold-on-black variant was
  built and rejected — don't reinstate it.
- Copy follows S5Tech's **#BeClear**, **Context** and **Over-Communicate** frameworks.
- Showcase only — no asks, no decisions, no "what we need from you" sections.
- Avoid the word *production* for tools in use; S5 uses it for the live game/BO
  environment. Say "in active use".
- The pilot tool's raw IP address belongs in the `Test now` href only, never in
  visible text.
- Project counts appear in four places (scope bar, tallies, context panel,
  footer). They have drifted before — update all four together.
