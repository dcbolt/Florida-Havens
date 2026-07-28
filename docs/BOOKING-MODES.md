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

## Turning it on

1. In Guesty: **Integrations → OAuth Applications → New Application**. Scope it
   **read-only**. This client only issues GETs, and a token that cannot write
   cannot damage a live PMS.
2. Set `GUESTY_CLIENT_ID` and `GUESTY_CLIENT_SECRET` in the deployment
   environment. **Never in this repo** — no `.env` file, no commit, no pasting
   into an agent chat or the cross-agent log.
3. Deploy, then check the first booking page and the logs.

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
