#!/usr/bin/env python3
"""Verify every foreground/background pair the site actually uses meets WCAG AA.

Run in CI. Exits non-zero on any text pair below 4.5:1.

Why this exists: the brand gold lifted from the live site (#c0a91e) measures
2.35:1 on white — it fails AA for text and even the 3:1 non-text threshold. It
was being used on the required-field asterisks in the guest-story form, which
carry real meaning. The site publishes an accessibility statement, so a
contrast failure is a commitment gap, not a nitpick.

Token tiers:
  brass-500  decorative fills only  — never text, never a state indicator
  brass-600  3.15:1 — non-text UI affordances (icons, indicators)
  brass-700  4.96:1 — the only brass safe for text
"""
import re, sys

TOKENS = {
    "ocean-700": "#2b5672", "ocean-500": "#4a7794", "ocean-300": "#8fadc2",
    "ocean-50": "#f2f6f9", "brass-400": "#d6c34f", "brass-500": "#c0a91e",
    "brass-600": "#a5911a", "brass-700": "#7f7014", "sand-50": "#faf8f4",
    "white": "#ffffff", "neutral-800": "#292524", "neutral-700": "#44403c",
    "neutral-600": "#57534e", "neutral-500": "#78716c", "body-text": "#1f2933",
}

# (foreground, background, description, kind) — kind: 'text' needs 4.5, 'ui' needs 3.0
PAIRS = [
    ("ocean-700", "white", "headings and links on white", "text"),
    ("body-text", "white", "body copy", "text"),
    ("neutral-700", "white", "migrated body copy", "text"),
    ("neutral-600", "white", "card descriptions", "text"),
    ("neutral-500", "white", "uppercase labels, breadcrumbs", "text"),
    ("white", "ocean-700", "button and CTA band text", "text"),
    ("ocean-700", "sand-50", "text on sand cards", "text"),
    ("ocean-700", "ocean-50", "text in notice boxes", "text"),
    ("neutral-700", "sand-50", "highlight bullets on sand", "text"),
    ("brass-700", "white", "required-field asterisks", "text"),
    ("brass-700", "sand-50", "accents on sand", "text"),
    ("brass-600", "white", "decorative bullets and indicators", "ui"),
]


def lum(h):
    h = h.lstrip("#")
    ch = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (f(c) for c in ch)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def main():
    fail = 0
    print(f"{'foreground':13} {'background':11} {'ratio':>6} {'need':>5}  result  use")
    print("-" * 92)
    for fg, bg, use, kind in PAIRS:
        need = 4.5 if kind == "text" else 3.0
        r = ratio(TOKENS[fg], TOKENS[bg])
        ok = r >= need
        if not ok:
            fail = 1
            print(f"::error::{fg} on {bg} is {r:.2f}:1, needs {need}:1 ({use})")
        print(f"{fg:13} {bg:11} {r:6.2f} {need:5.1f}  "
              f"{'PASS' if ok else 'FAIL':6}  {use}")

    # brass-500 fails even 3:1 — it must never be applied to text or an icon.
    src = []
    import os
    for root, _dirs, files in os.walk("."):
        if any(x in root for x in ("node_modules", ".next", ".git")):
            continue
        for f in files:
            if f.endswith((".tsx", ".ts")):
                src.append(os.path.join(root, f))
    offenders = []
    for f in src:
        body = open(f, encoding="utf-8").read()
        for m in re.finditer(r"text-brass-500|fill-brass-500|stroke-brass-500", body):
            offenders.append(f"{f}: {m.group(0)}")
    if offenders:
        fail = 1
        print()
        for o in offenders:
            print(f"::error::brass-500 applied to text/icon ({o}) — "
                  f"2.35:1 on white. Use brass-700 for text, brass-600 for icons.")
    else:
        print("\nbrass-500 not applied to any text or icon. OK.")

    sys.exit(fail)


if __name__ == "__main__":
    main()
