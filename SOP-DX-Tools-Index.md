# SOP · DX Tools Index

**Owner:** Digital Experience (DX)
**Applies to:** everyone with an `@s5tech.co` email
**Site:** <https://dx-tools-index.vercel.app> · sign-in required
**Repository:** `golds5/dx-tools-index`
**Version:** 1.0 · 9 September 2026
**Review:** every quarter, or on the day any listed project changes status

---

## 1. Purpose

DX builds and runs its own software. Eight projects exist and no single place listed them, so
other teams asked DX what exists, what it does, and whether they can use it.

The DX Tools Index answers that in one page. It is a showcase: it explains each project, states
what is measured and what is not, and links straight to the tool.

**Success:** anyone at S5Tech can see what DX has built, understand why it exists, and open it —
without asking DX.

**Out of scope:** the site takes no requests, holds no decisions, and is not a roadmap.

---

## 2. What the site is

One gated page listing every project DX has built, grouped into three scopes.

| Scope | What it means | Count today |
| --- | --- | --- |
| Scope 1 | Built and run inside DX | 5 tools · 4 in active use, 1 in pilot |
| Scope 2 | Built in DX, testing with another team | 1 tool · DX + UX Lab |
| Scope 3 | Original game prototypes, built with AI | 2 prototypes · playable |

Each project is one card. A card is closed by default and opens to show: why we built it, what it
does, the result, and what is not measured. Every card has its own button to the live tool.

### 2.1 Projects listed

| Project | Scope | Status | Access |
| --- | --- | --- | --- |
| DX-GRD · Game Release Date Checker | 1 | Live | Open link |
| DX-GST · Game Speed Test | 1 | Live | Shared team login |
| Square Icon Pro | 1 | Live | Team login · 11 named users |
| Licence Registry Lookup | 1 | Live | Open link |
| Competitor Games Scanner | 1 | Pilot | VPN + sign-in, internal host |
| S5 Onboarding | 2 | Live | S5 email + access code |
| Jade Fortune | 3 | Live | Free play, no cash value |
| Muay Thai Champion · Golden Belt | 3 | Live | Free play, no cash prizes |

---

## 3. Roles

| Role | Who | Owns |
| --- | --- | --- |
| Registry owner | The DX addresses in the `OWNERS` array in `index.html` | Content, access map, approving every change |
| Editor | Any DX member with repository access | Drafting card copy and pushing branches |
| Reader | Anyone with an `@s5tech.co` email | Reading the page, opening the tools |

**Rule:** every content change is reviewed by the registry owner before it reaches `main`.

---

## 4. How to use the site (reader)

1. Open <https://dx-tools-index.vercel.app>.
2. Sign in with your `@s5tech.co` email and the shared DX password. Password not held → ask DX.
3. Read the card you need. Click the card header to expand it.
4. Click the button on the card (`Use now`, `Play now`, `Test now`) to open the tool.
5. `Expand all` opens every card. `Dark` switches theme. `Sign out` clears the session.

Session lasts **12 hours**, then sign-in is required again.

**Access map ↗** appears in the toolbar for registry owners only. It links to the Notion page
listing who has access to which tool. Hidden for everyone else.

### 4.1 Before opening Competitor Games Scanner

It runs on the internal network and uses a self-signed certificate. Expect both:

- No VPN → the page will not load. Connect to VPN first.
- Browser shows a security warning → this is expected for an internal pilot host. Continue, then
  sign in.

---

## 5. How the gate works

| Path | Public | Note |
| --- | --- | --- |
| `/login`, `/api/login`, `/api/logout`, `/robots.txt`, `/favicon.ico` | Yes | No session needed |
| Everything else | No | Redirects to `/login` without a valid cookie |

- `middleware.js` runs at the edge, before any file is served. An unauthenticated client never
  receives `index.html`.
- `api/login.js` accepts a request only when the email ends in `@s5tech.co` **and** the password
  matches `AUTH_PASSWORD`. It then sets a cookie signed with `AUTH_SECRET` (HMAC-SHA256).
- Cookie: `HttpOnly; Secure; SameSite=Lax`, 12-hour expiry.
- `api/me.js` reports who is signed in. It grants nothing — it only decides whether the
  Access map link is shown.
- `vercel.json` sends `noindex, nofollow, noarchive`, `X-Frame-Options: DENY`, and
  `Cache-Control: private, no-store` on `/`.

Secrets live in Vercel environment variables. **Never in the repository.**

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Signs the session cookie |
| `AUTH_PASSWORD` | The shared sign-in password |

---

## 6. Content rules

These are not preferences. A change that breaks one of these is rejected.

1. The page speaks as the DX department. **No individual names.**
2. Light "Liquid Glass" (macOS Tahoe) design. A dark gold-on-black variant was built and
   rejected — do not reinstate it.
3. Copy follows **#BeClear**, **Context** and **Over-Communicate**. Specific, short, simple,
   obvious.
4. Showcase only. No asks, no decisions, no "what we need from you".
5. Do not write *production* for a tool in use. S5 uses that word for the live game and BO
   environment. Write **in active use**.
6. A tool's raw IP address belongs in the `Test now` link only, never in visible text.
7. State what is **not** measured. A tool with no run counter says so on the card.
8. No number without a source. Cannot evidence it → do not publish it.

### 6.1 Project counts appear in four places

They have drifted before. Change one → change all four in the same commit:

1. Scope bar segments in the header (`5` / `1` / `2` and the caption line).
2. Scope tallies — the `tally` line inside each of the three scope panels.
3. Context panel — the `Why this page exists` entry.
4. Footer — the total and the live-versus-pilot split.

---

## 7. Procedure · Add a project

**Trigger:** DX ships a tool or prototype and it is reachable by its intended users.

1. Confirm the project qualifies. Built by DX, working, and someone outside the builder can open
   it. Not yet → do not list it.
2. Decide the scope (1, 2 or 3) from the table in section 2.
3. Branch from `main`. One project per branch.
4. Copy the nearest existing `<article class="card glass">` block inside that scope's `.cards`
   container and edit it. Keep the structure: `summary` (name, tag, kicker, pitch, button) then
   `cbody` sections.
5. Write the card to the section 6 rules. Required sections: **Why we built it**, **What it
   does**, **Result**. Add **Open issues** when they exist.
6. Set the status tag: `Live` or `Pilot`. Add the access note (`Team login`, `Sign-in`,
   `Internal`) when the tool is not an open link.
7. Update all four counts (section 6.1).
8. Add any new image as `.webp`. Keep it under 500 KB. Set `width` and `height` on the tag.
9. Preview locally (section 11), then push and open a pull request.
10. Registry owner reviews and merges. Merge to `main` deploys.
11. Verify on the live site (section 10).

---

## 8. Procedure · Update or retire a project

### Update copy or a result

1. Branch from `main`.
2. Edit the card. Keep the numbers evidenced — remove a claim rather than let it go stale.
3. Counts unchanged → no other edit needed. Counts changed → section 6.1.
4. Pull request, review, merge, verify.

### Change status

| Change | Do this |
| --- | --- |
| Pilot → in active use | Swap the `Pilot` tag for `Live`, rewrite **Where it is** as **Result**, update the four counts and the scope tally split |
| Live → down or broken | Note it in **Open issues** the same day. Link still broken after 5 working days → remove the button and mark the card `Paused` |
| Scope 2 pilot → company-wide | Move the card to the scope it now belongs to, rewrite the scope panel text, update the four counts |

### Retire a project

1. Confirm with the registry owner that the tool is switched off, not just quiet.
2. Delete the card and its images.
3. Update the four counts.
4. Say so in the commit message: what was removed and why.

---

## 9. Procedure · Manage access

| Situation | Action |
| --- | --- |
| New joiner needs the site | Share the URL and the current password over a private channel. Never in a public channel, never in a document. |
| Someone leaves S5Tech | Rotate `AUTH_PASSWORD` in Vercel, then redeploy. Their session dies within 12 hours. |
| Password suspected leaked | Rotate `AUTH_PASSWORD` **and** `AUTH_SECRET` in Vercel immediately, redeploy, tell DX in the team channel. Rotating `AUTH_SECRET` invalidates every live session at once. |
| Registry owner changes | Edit the `OWNERS` array in `index.html`, and update sharing on the Notion access map. Both, or the link shows to the wrong person. |

**Rotation:** change `AUTH_PASSWORD` every quarter and after any leaver. `[Owner to confirm who
holds the calendar reminder.]`

Hiding the Access map link is tidiness, not protection. The Notion page enforces its own access.

---

## 10. Procedure · Deploy and verify

Push to `main` → Vercel deploys to production. `vercel deploy --prod` is the manual fallback.

Check all five within 10 minutes of a deploy:

1. Open the site in a private window. It redirects to `/login`.
2. Sign in with an `@s5tech.co` email. The page loads.
3. Sign in with a non-S5 email. It is refused.
4. Expand the card you changed. Copy and images render.
5. Click the card's button. The tool opens.

Any check fails → revert the commit on `main` first, fix on a branch second.

---

## 11. Local preview

The gate is Edge Middleware and does **not** run under a plain static server. A local preview
shows the page ungated. Fine for checking layout, not the same as the deployed site.

```bash
cd <path-to-working-copy> && python3 -m http.server 8900
```

To exercise the real gate, run `vercel dev`.

---

## 12. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Sign-in returns "Server is not configured" | `AUTH_SECRET` or `AUTH_PASSWORD` missing in Vercel | Set both in the Vercel project, redeploy |
| Correct password refused | Email does not end in `@s5tech.co`, or the password was rotated | Check the address, then get the current password from DX |
| Signed in, then bounced to `/login` | Session older than 12 hours, or `AUTH_SECRET` was rotated | Sign in again |
| A tool's button 404s or times out | The tool moved or is down | Contact that tool's owner. Still down after 5 working days → section 8 |
| Competitor Games Scanner shows a certificate warning | Self-signed certificate on the internal host | Expected. Confirm VPN is on and continue |
| Card counts disagree with each other | A previous edit missed one of the four places | Fix all four in one commit (section 6.1) |
| Hero clip does not play | Autoplay refused, or the reader has reduced-motion on | Expected. The still image stays up. No action |

---

## 13. Security rules

1. Never commit `AUTH_SECRET`, `AUTH_PASSWORD`, a `.env` file, or the `.vercel` folder.
2. Never put a password or an access code in card copy.
3. Never remove the `noindex` headers or `robots.txt`. This page is not for the open internet.
4. Never share the sign-in outside `@s5tech.co`.
5. Screen-sharing the site → do not open the Access map, and do not expand a card holding an
   internal address.

---

## 14. Review

| What | How often | Who |
| --- | --- | --- |
| Every card still accurate, every link still opens | Quarterly | Registry owner |
| Counts match across all four places | Every content change | Editor |
| `AUTH_PASSWORD` rotated | Quarterly, and after any leaver | Registry owner |
| Dated register snapshots inside Licence Registry Lookup | Quarterly | That tool's owner |
| This SOP | Quarterly, or when a procedure changes | Registry owner |

---

## 15. Change log

| Date | Version | Change |
| --- | --- | --- |
| 9 Sep 2026 | 1.0 | First version. Covers eight projects: 5 in Scope 1, 1 in Scope 2, 2 in Scope 3. |
