# Brief for the in-browser agent — Guesty reconnaissance

**Paste everything below the line into the Claude sidebar with the Guesty
dashboard open.**

This is a **read-only fact-finding task**, not a change task. It unblocks
`content/booking.ts` (Option A, already built and merged) and scouts whether
Option B — server-rendered availability via the Guesty Open API — is even
available on this account.

Companion: [`BROWSER-AGENT-BRIEF.md`](BROWSER-AGENT-BRIEF.md) is the Wix
equivalent and the same working rules apply.

---

## CONTEXT

The Florida Havens books direct through Guesty. Their marketing site is being
rebuilt, and the booking step now **deep-links to the Guesty booking engine**
instead of embedding it in an iframe. Everything is built and tested; it is
switched off pending a handful of facts only this dashboard can supply.

## RULES — read before clicking anything

1. **CHANGE NOTHING.** This is a live property-management system holding real
   reservations, rates and calendars. Do not edit a listing, a rate, a
   calendar, a setting, or a template. Do not toggle anything. Do not click
   Save on any screen, even one you opened by accident — back out instead.
2. **NEVER paste an API key, secret, token, password or client secret into this
   chat.** These answers go into a shared engineering log in a git repository.
   Where the task asks about credentials, report only **whether they exist and
   where they live** — never their values. If you have already seen one, do not
   quote it.
3. **Do not create API credentials.** If you find the screen that would generate
   them, note that it exists and stop. Devin decides whether to issue them.
4. **Report what you actually see.** If a screen, field or menu is not where this
   brief says, say so and describe what is there. The paths below are inferred
   from Guesty's general layout, not confirmed for this account.
5. **Say "I could not find it."** A clear negative is a useful result. A guess
   presented as a finding is not.

---

# PART 1 — What Option A needs (the priority)

## 1.1 The booking engine's public URL

Find the **guest-facing** booking engine — the site a guest actually books on,
not the admin dashboard. In Guesty this is usually under **Booking Engine**,
**Websites**, or **Distribution**.

Report the **exact origin**, e.g. `https://something.guestybookings.com`.

## 1.2 The listing URL pattern — get this from the engine, not from docs

Open the public booking engine as a guest would. Click into **one** property.

Report the **full URL from the address bar**, verbatim.

This is worth more than any documentation, because it is ground truth for how
this specific engine builds URLs. The rebuild currently assumes
`/properties/{listingId}` and that assumption is unverified.

## 1.3 The date parameters — the single most important item

Still on the public engine, on that one listing:

1. Pick a **check-in and check-out date** in the engine's own date picker.
2. Set a **guest count**.
3. **Copy the URL from the address bar again.**
4. Change the dates to something different and **copy it a third time.**

Report all three URLs verbatim.

Comparing them tells us the real parameter names and formats — whether it is
`checkIn` or `check_in` or `startDate`, whether dates are `2026-09-14` or
`09/14/2026`, and what the guest parameter is called.

> **A negative result here is a real and useful answer.** If the URL does **not**
> change when you pick dates, the engine keeps them in app state rather than the
> query string. Say so plainly. That means the date form gets dropped and the
> page simply links to the listing — still a large improvement, and better to
> know now than to ship a form whose values are silently discarded.

## 1.4 The listing IDs

There are **four houses** and **two campuses**:

| Site slug | Property | Sleeps |
|---|---|---|
| `turtle-haven` | Turtle Haven | 8 |
| `shell-haven` | Shell Haven | 6 |
| `beach-haven` | Beach Haven | 8 |
| `sea-haven` | Sea Haven | 8 |
| `the-dunes` | The Havens at The Dunes = Turtle + Shell together | 14 |
| `beach-street` | The Havens at Beach Street = Beach + Sea together | 16 |

From **Listings** in the dashboard, report for **each listing that exists**:

- the listing name as Guesty shows it
- **the listing ID** — usually a 24-character hex string visible in the address
  bar when a listing is open, e.g. `…/listings/64f1a2b3c4d5e6f7a8b9c0d1`
- which of the six slugs above it corresponds to

## 1.5 Do combined listings exist? (needs a clear yes or no)

**Is there a Guesty listing that books The Dunes as a whole** (Turtle + Shell
together), and one for **Beach Street as a whole** (Beach + Sea)? Is there
anything covering **all four houses** at once?

If yes, give their IDs. If no, say so explicitly.

> This matters more than it looks. If no combined listing exists, those pages
> must route to a phone/email enquiry — which is how the site is built today.
> Pointing a campus page at one of its constituent houses would let a guest book
> half a compound believing they had booked all of it.

---

# PART 2 — Is Option B possible? (facts only, no credentials)

Option B renders live availability and nightly rates as real HTML on the
property pages, keeping Guesty's hosted checkout for payment. It needs Open API
access, which is **tier-dependent** — so the first question decides the rest.

## 2.1 Which Guesty product is this account on?

Look in **Settings → Plan / Subscription / Billing**, or whatever the account
menu shows. Report the product name exactly as written — e.g. *Guesty for
Hosts*, *Guesty Lite*, *Guesty Pro*, *Guesty Enterprise*.

## 2.2 Is there an API / integrations surface?

Look for **Settings → Integrations**, **Marketplace**, **Developer**, or
**API Keys**.

Report:
- whether an API or developer section exists at all
- what it is called and where it sits
- whether it offers creating an API key / OAuth app / integration token
- whether anything is **already** connected (list integration names only)

**Do not create anything. Do not reveal any existing key.**

## 2.3 Who processes payments?

Guesty Payments, Stripe, or something else? One line. This determines whether
checkout can stay hosted — which is what keeps card data out of scope entirely.

## 2.4 Rate and availability visibility

On one listing, confirm whether you can see **nightly rates** and a
**availability calendar** in the dashboard. Report yes/no and roughly what
granularity (per-night pricing, seasonal rules, minimum-stay rules).

This is a feasibility check for what Option B could surface publicly — **not** a
request to transcribe anyone's pricing.

---

# PART 3 — Two long shots worth thirty seconds each

## 3.1 Turtle Haven's virtual tour URL

Outstanding blocker on the rebuild: the live site has a virtual tour for Turtle
Haven, but it is injected client-side by a Wix component so no provider URL
survives in the page source. **Guesty listings sometimes carry a "virtual tour"
or "3D tour" field.** Check Turtle Haven's listing details and any media or
description tab. If a Matterport/Zillow-3D/other tour URL is there, report it.

## 3.2 Minimum-night rules

If it is visible without digging, note the minimum-stay rule per listing. Not
required — it would let the date form warn a guest before they bounce off the
engine.

---

# REPORT BACK IN THIS SHAPE

```
PART 1 — OPTION A

booking engine origin: ____

listing URL, no dates:      ____
listing URL, dates set:     ____
listing URL, dates changed: ____
→ do dates appear in the URL at all?  YES / NO

listing IDs:
  Turtle Haven  = ____
  Shell Haven   = ____
  Beach Haven   = ____
  Sea Haven     = ____

combined listings:
  The Dunes (Turtle+Shell) : EXISTS id=____  /  DOES NOT EXIST
  Beach Street (Beach+Sea) : EXISTS id=____  /  DOES NOT EXIST
  All four together        : EXISTS id=____  /  DOES NOT EXIST

any listing in Guesty that is NOT one of the six above: ____

PART 2 — OPTION B FEASIBILITY

Guesty product/tier (exact wording): ____
API / developer section: EXISTS at ____  /  NOT FOUND
  can it issue keys?  YES / NO / UNCLEAR      (do NOT issue one)
  already-connected integrations: ____
payment processor: ____
nightly rates visible in dashboard: YES / NO
availability calendar visible:      YES / NO

PART 3

Turtle Haven virtual tour URL: ____  /  no such field
minimum-night rules: ____

ANYTHING THAT DID NOT MATCH THIS BRIEF:
  ____

CONFIRM: I changed nothing, created no credentials, and pasted no secrets.
```

The last line is not a formality. Everything above is readable without altering a
single record, and this system holds real bookings.
