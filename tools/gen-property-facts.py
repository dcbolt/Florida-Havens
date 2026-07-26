#!/usr/bin/env python3
"""Generate content/property-facts.ts from the live-site content snapshot.

Why this is generated rather than hand-written: the first pass at properties.ts
had invented occupancy and bedroom counts, and they were wrong on five of six
homes. Those values feed VacationRental JSON-LD (numberOfBedrooms, occupancy),
so a wrong guess is published misinformation, not a cosmetic slip.

Everything here is lifted from the live pages so it cannot drift from what the
site actually claims.

Deliberately NOT extracted: the GUEST FEEDBACK testimonials. They carry real
guest first names and cities, and republishing attributed personal content on a
new domain needs Devin's sign-off first.

Usage:
  python3 tools/gen-property-facts.py backups/content-snapshot-2026-07-26.json.gz
"""
import gzip, json, re, sys

SLUGS = ["turtle-haven", "shell-haven", "beach-haven", "sea-haven",
         "the-dunes", "beach-street"]
BASE = "https://www.thefloridahavens.com"

STOP = re.compile(r"^(BOOK|TAKE A VIRTUAL|GUEST FEEDBACK|PLAN YOUR)", re.I)


def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


def clean(s):
    # Wix litters copy with zero-width spaces and stray "HERE ." link remnants.
    s = s.replace("​", " ")
    s = re.sub(r"\s+HERE\s*\.?", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip().rstrip(".") + "." if s.strip() else ""


def parse(page):
    t = page["text"]
    facts = {}

    for l in t[:40]:
        if m := re.match(r"^(\d+)\s+Guests?$", l, re.I):
            facts["sleeps"] = int(m.group(1))
        elif m := re.match(r"^(\d+)\s+King Bedrooms?$", l, re.I):
            facts["bedrooms"] = int(m.group(1))
        elif m := re.match(r"^([\d.]+)\s+Baths?$", l, re.I):
            facts["baths"] = float(m.group(1))
        elif re.match(r"^Private .*(Pool|Beach|Grill)", l, re.I):
            facts["amenitySummary"] = clean(l).rstrip(".")

    if m := next((l for l in t[:22] if re.search(r",\s*FL\s*\d{5}", l)), None):
        loc, zipc = re.match(r"^(.*?),\s*FL\s*(\d{5})", m).groups()
        facts["locality"] = loc.strip()
        facts["postalCode"] = zipc

    welcome = []
    try:
        i = next(j for j, l in enumerate(t) if l.upper().startswith("WELCOME TO"))
        for l in t[i + 1:i + 14]:
            if STOP.match(l):
                break
            if len(l.split()) > 6:
                c = clean(l)
                # Drop the cross-sell sentence; the site links campuses itself.
                if c and not re.search(r"can be rented together", c, re.I):
                    welcome.append(c)
    except StopIteration:
        pass
    facts["welcome"] = welcome
    return facts


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    d = json.load(gzip.open(sys.argv[1], "rt"))
    by = {p["url"].replace(BASE, ""): p for p in d["pages"]}

    out = ['''/**
 * Property facts and long-form copy, GENERATED from the live site.
 *
 * Do not hand-edit. Regenerate with:
 *   python3 tools/gen-property-facts.py backups/content-snapshot-<stamp>.json.gz
 *
 * This module exists because the first hand-written pass invented occupancy and
 * bedroom counts and got them wrong on five of six homes. Those values feed
 * VacationRental JSON-LD, so a guess is published misinformation.
 *
 * GUEST FEEDBACK testimonials are deliberately excluded — they carry real guest
 * names and cities, and republishing attributed personal content on a new domain
 * needs sign-off first.
 */
export type PropertyFacts = {
  sleeps: number
  bedrooms: number
  baths: number
  amenitySummary: string
  locality: string
  postalCode: string
  /** "WELCOME TO …" body copy, verbatim from the live page. */
  welcome: string[]
}

export const PROPERTY_FACTS: Record<string, PropertyFacts> = {''']

    for slug in SLUGS:
        p = by.get("/" + slug)
        if not p:
            sys.exit(f"missing /{slug} in snapshot")
        f = parse(p)
        for k in ("sleeps", "bedrooms", "baths", "locality", "postalCode"):
            if k not in f:
                sys.exit(f"/{slug}: could not extract {k}")
        out.append(f"  '{slug}': {{")
        out.append(f"    sleeps: {f['sleeps']},")
        out.append(f"    bedrooms: {f['bedrooms']},")
        out.append(f"    baths: {f['baths']},")
        out.append(f"    amenitySummary: '{esc(f['amenitySummary'])}',")
        out.append(f"    locality: '{esc(f['locality'])}',")
        out.append(f"    postalCode: '{f['postalCode']}',")
        out.append("    welcome: [")
        for w in f["welcome"]:
            out.append(f"      '{esc(w)}',")
        out.append("    ],")
        out.append("  },")
        print(f"{slug:15} {f['sleeps']:2}g {f['bedrooms']}bd {f['baths']}ba "
              f"{f['locality']:16} welcome={len(f['welcome'])}")
    out.append("}\n")

    open("content/property-facts.ts", "w").write("\n".join(out))
    print("\nwrote content/property-facts.ts")


if __name__ == "__main__":
    main()
