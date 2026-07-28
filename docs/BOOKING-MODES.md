# Booking: live availability, and how to turn it off

Two modes. **They are layers, not alternatives** — which is the whole reason
this is safe to run.

| Mode | What the guest sees | Needs |
|---|---|---|
| **`deeplink`** (Option A) | Trust copy, photos, stay rules, and a no-JavaScript date form that hands off to the Guesty booking engine | nothing |
| **`live`** (Option B) | All of the above, **plus** a server-rendered panel of real availability and nightly rates above it | Guesty API credentials |

Option A is the substrate. It is what takes the booking in *both* modes — the
deep-link form is the checkout hand-off either way. Option B only adds a panel
on top. So turning B off removes a panel; it never breaks a booking flow.

---

## Rolling back

Three levels, and you rarely need the third.

### 1. Automatic — nothing to do

Any Guesty failure degrades that page to Option A on its own: bad credentials,
a revoked token, a 401/403, a 429 rate limit, a 5xx, a request timeout, a
response shape we do not recognise, an empty calendar, or cached data older than
six hours. `lib/guesty.ts` never throws and returns `null` on all of them;
`AvailabilityPanel` renders nothing when it gets `null`.

Every one of those paths is asserted in CI by
[`tools/test-guesty-fallback.mjs`](../tools/test-guesty-fallback.mjs), which
stands up a fake Guesty and checks them without needing network or credentials.

Each fallback logs one line beginning `[guesty]`. **Watch for those** — the page
looks completely normal when it happens, so the log is the only signal.

### 2. Remove the credentials

Unset `GUESTY_CLIENT_ID` / `GUESTY_CLIENT_SECRET` and redeploy. No requests are
made at all. This is also the state of every local checkout and of CI.

### 3. The kill switch

```
BOOKING_MODE=deeplink
```

Set it and redeploy. **This wins over everything, including valid credentials.**

It exists so that "live availability is showing something wrong" does not
require finding and revoking a credential under time pressure. One variable,
one redeploy, and the site is back to exactly the behaviour that shipped in
`cf06954`.

---

## ⚠ Read this before creating credentials: the token quota

**Guesty allows only 5 access-token requests per key per 24 hours.** Tokens
themselves last ~24h. This is a daily quota, not a rate limit — spend it and the
key is unusable until the window rolls.

Two rules follow, and both matter more than anything else on this page.

### Do not reuse Media Haven's Guesty key here

The quota is **per key**. Media Haven already runs an OAuth application against
this account (`MEDIA HAVEN`, powering the guest portal), and it holds the same
5-per-day budget. If the marketing site shares that key, a bad deploy here spends
Media Haven's budget and **takes the guest portal's Guesty access down for up to
24 hours**.

It is also the wrong direction on two other counts: this site needs **read-only**
scope where the portal needs more, and the marketing site must not couple to Stay
OS infrastructure.

**Issue a separate, read-only OAuth application for the marketing site.**

### The token is cached across invocations, not per request

`lib/guesty.ts` caches the token with `unstable_cache` for 23 hours, in the same
incremental cache the framework uses for data — shared across invocations and
regions, so this works out to roughly **one token request per day**.

This is worth understanding rather than trusting, because the naive version looks
correct and passes every test: a process-local cache mints a fresh token on every
**cold start**, and with a 15-minute ISR window over six listings that is dozens
of requests a day. This client had exactly that bug until media-haven's
`lib/guesty.ts` — which solves the same problem with a Supabase-backed token
table — was read.

`mintToken` also refuses after a small number of attempts per process, so a retry
bug cannot quietly spend a day's budget. That cap is asserted in the test suite.

**A 401/403 does not trigger a re-mint.** Retrying auth failures is precisely how
the quota gets burned, so the client logs and falls back to Option A instead.
Recovering from a rotated or revoked credential therefore needs either a redeploy
or `revalidateTag('guesty:token')` — the tag is in place, the route handler to
call it is not built.

---

## Turning it on — creating the OAuth application

### 1. Create it in Guesty

**Integrations → OAuth Applications** (confirmed at
`app.guesty.com/integrations/oauth-apps`, page titled *Open API*) →
**New Application**.

**Do not open or edit `MEDIA HAVEN`.** That is the guest portal's application and
it must keep its own token budget.

Name it so the two can never be confused six months from now:

| Field | Value |
|---|---|
| Name | `TFH Marketing Site (read-only)` |
| Description | `Availability + rates for thefloridahavens.com booking pages. Read-only.` |

### 2. Scopes — read-only, and only what is used

This client issues **GETs only**. A token that cannot write cannot damage a live
PMS, and the marketing site has no business being able to.

What it actually needs:

- **listings** — read
- **availability / calendar / pricing** — read

What it must **not** be granted, even if offered as a convenient bundle:

- reservations — **write** (this is the one that could create or alter bookings)
- guests / guest data — anything
- payments or payouts — anything
- webhooks, users, accounts — anything

I have not seen this screen, so I cannot name Guesty's exact scope strings.
**Report what the picker offers** and grant the narrowest read set covering
listings and calendar. If it only offers a single all-or-nothing scope, say so
before accepting it — that is a decision worth making deliberately rather than
clicking through.

### 3. The secret is shown once

Guesty displays the client secret **once, at creation**. Copy it straight into a
password manager.

**Do not paste it into a chat with me, into the browser agent, into
`docs/TFH-WEBSITE.md`, or into any file in either repo.** The cross-agent log is
a shared document in git. If it lands somewhere it should not, treat it as
compromised: delete the application in Guesty and create a new one.

### 4. Set the environment variables — production only

In Vercel → the project → **Settings → Environment Variables**:

| Variable | Value | Environments |
|---|---|---|
| `GUESTY_CLIENT_ID` | from Guesty | **Production only** |
| `GUESTY_CLIENT_SECRET` | from Guesty | **Production only** |

**Production only is deliberate, not laziness.** Preview deployments regenerate
pages too, so credentials on Preview would draw from the same 5-tokens-per-day
budget as Production — every PR preview competing with the live site for a quota
that takes 24 hours to recover. Preview also has no business showing live
availability on a shareable URL.

Leaving them unset on Preview puts previews in `deeplink` mode automatically. If
you would rather be explicit, add `BOOKING_MODE=deeplink` scoped to Preview.

### 5. Deploy and verify

Redeploy — the mode is decided when a page is generated, so this does not take
effect until a build runs.

Then, on a booking page such as `/book/turtle-haven`:

| What you see | Meaning |
|---|---|
| A **"Next 60 nights"** panel above the date form | working |
| No panel, date form still there | fell back to Option A — **check the logs**, this is the designed symptom of a wrong endpoint or scope |
| Anything broken | should be impossible; the panel is additive. Set `BOOKING_MODE=deeplink` and tell me |

Check the deployment logs for lines beginning `[guesty]`. There should be none.
If there are:

| Log line | Cause |
|---|---|
| `token unavailable: token request failed: 401` | wrong client id/secret |
| `token unavailable: token request failed: 403` | scopes too narrow, or app not approved |
| `unrecognised calendar shape` | the calendar returned something we do not parse — most likely remaining unknown |
| `calendar 404` | wrong path |
| `calendar 401/403 … token rejected` | scopes exclude calendar reads |
| `refusing to mint` | the per-process cap tripped; means something is retrying. Tell me |

### 6. Tell me two things afterwards

1. **Whether the panel appeared**, and any `[guesty]` log lines verbatim.
2. **Whether a nightly rate showed** — the "from $X a night" clause. That is the
   last unverified assumption in the client: Media Haven reads only `date` and
   `status` from the calendar, so nothing yet proves this plan returns `price`.
   Its absence is harmless and costs one sentence, but I need to know before
   pricing can go into structured data.

> **Both modes take effect on deploy, not instantly.** Booking pages are
> prerendered with `revalidate = 900`, so the mode is decided when a page is
> generated. Setting or clearing `BOOKING_MODE` needs a redeploy to apply
> everywhere — verified by building with valid credentials *and*
> `BOOKING_MODE=deeplink`, which correctly produced no panel and a working
> deep-link form. Without a redeploy, existing pages flip as they revalidate.

### Verify it before trusting it

The endpoint paths and response shapes in `lib/guesty.ts` follow Guesty's
documented Open API conventions but have **never been exercised against this
account**. Treat them as unverified.

That is not pessimism. On the deep-link work, two of three assumptions about
Guesty's URL format were wrong — the path carries an `/en` locale segment and
the guest parameter is `adults`, not `guests`. Assume something here is wrong
too.

The failure is designed to be quiet and safe, which also makes it easy to miss.
**If the panel does not appear after you set credentials, that is the expected
symptom of a wrong endpoint** — the site will look completely fine. Check the
logs for `[guesty]`:

| Log line | Means |
|---|---|
| `token request failed: 401` | wrong client id/secret |
| `unrecognised calendar shape` | the calendar endpoint returned something we do not parse — most likely cause |
| `calendar 404` | wrong path |
| `rate limited` | back off; consider a longer revalidate |

---

## What "live" actually shows, and what it deliberately does not

Availability is cached for **15 minutes** (`AVAILABILITY_REVALIDATE_SECONDS`,
matched by `export const revalidate` on the booking route so the page and its
data expire together).

Stale availability is the one genuinely dangerous thing here — showing a week as
free after it has been booked costs a guest and an afternoon of Craig's time.
Three deliberate choices:

1. **The page never claims a date is bookable.** It says which nights *show as
   open* and that checkout confirms. Guesty re-validates at booking regardless,
   so the transaction is always safe; the wording just stops the page
   overstating what it knows.
2. **An "as of" timestamp is always rendered.** Data with no timestamp reads as
   live.
3. **Data older than six hours is not rendered at all.** If the cache somehow
   serves something very old, the panel disappears rather than misinform.

---

## Why this is worth having

The live Wix site puts availability inside a client-injected iframe. A page that
could tell Google *"Turtle Haven, 14–21 March, $4,200, available"* instead says
nothing a crawler can read, on a page that transfers **12.9 MB** with a **27.4 s**
mobile LCP.

Option A already fixed the weight. Option B is what makes the availability
itself indexable — and it is the only version that can eventually carry real
pricing in `VacationRental` structured data, which is what rich results need.

---

## Not yet done

- **Pricing in JSON-LD.** Deliberately held back until the API shapes are
  verified against the real account. Publishing a wrong price in structured data
  is materially worse than publishing none.
- **`revalidateTag` on booking webhooks.** Every fetch is tagged
  `guesty:listing:<id>` and `guesty:availability`, so a Guesty webhook could
  refresh one listing instantly instead of waiting out the 15-minute window.
  The tags are in place; the webhook route is not built.
