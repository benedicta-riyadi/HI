# Design

## Theme

Light, warm, and confident. A pure-white surface lets two committed brand
colors do the work: a bright chartreuse-lime as the primary (playful, fresh,
not the SaaS-purple reflex) and a warm coral as the accent (the "warm" in warm
& playful). The page itself disappears; the color and typography carry the
mood. Color strategy: **committed** — lime anchors the hero, CTA band, and
primary actions; coral sparks links, badges, and highlights.

## Color (OKLCH)

| Role        | Value                      | Notes |
|-------------|----------------------------|-------|
| `--bg`      | `oklch(1 0 0)`             | Pure white. No hidden warmth. |
| `--surface` | `oklch(0.976 0.008 120)`   | Faint olive-tinted panel for sections/cards. |
| `--surface-2`| `oklch(0.945 0.013 120)`  | Deeper panel, code chrome. |
| `--ink`     | `oklch(0.24 0.018 130)`    | Body + headings. ~13:1 on white. |
| `--muted`   | `oklch(0.52 0.02 130)`     | Secondary text. ≥4.5:1 on white. |
| `--border`  | `oklch(0.915 0.008 130)`   | Hairlines. |
| `--primary` | `oklch(0.86 0.17 124)`     | Chartreuse-lime. Dark ink text on fills (pale fill). |
| `--accent`  | `oklch(0.64 0.19 32)`      | Warm coral. White text on fills. |
| `--ink-inv` | `oklch(0.97 0.01 120)`     | Text on dark/footer. |

Contrast checked: ink/bg ≈ 13:1, muted/bg ≈ 4.6:1, ink on primary ≈ 9:1,
white on accent ≈ 4.7:1. primary↔accent differ in both hue (124 vs 32) and
lightness (0.86 vs 0.64).

## Typography

- **Display (h1–h3):** Bricolage Grotesque (variable, optical sizing on).
  Quirky humanist-grotesque — character without shouting. Tracking -0.02 to
  -0.03em (never past the -0.04em floor). `text-wrap: balance`.
- **Body / UI:** Geist (variable). Neutral, clean — clear contrast axis against
  the display face. Line length capped ~68ch, `text-wrap: pretty` on prose.
- **Mono:** JetBrains Mono — code blocks, install commands, kbd, eyebrow tags.
- Hero clamp max 4.6rem (well under the 6rem ceiling).

All three are self-hosted (`site/fonts/*.woff2`, Latin subset) — no third-party
font dependency, no layout shift.

## Components

- **Buttons:** primary (lime fill, dark text), ghost (border + ink). 10px radius,
  no border+wide-shadow pairing.
- **Code card:** dark ink panel, mono, faux window chrome, copy affordance.
- **Feature layout:** asymmetric — one tall feature beside two stacked. Not an
  identical card grid.
- **Pricing:** three tiers, one highlighted with a solid lime header (not a
  glow). Radius 14px.
- **Badges/pills:** coral or lime fills, mono label.

## Layout

- Container max-width 1180px, fluid gutters.
- Varied vertical rhythm (sections breathe at different scales, not one uniform
  pad).
- Flexbox for 1D rows, Grid only where genuinely 2D.
- Semantic z-index scale (sticky → dropdown → modal → toast).

## Motion

- Ease-out-expo curves. No bounce/elastic.
- Scroll reveals enhance an already-visible default (content is visible without
  JS; reveal only adds a brief translate/fade when JS + motion allowed, with a
  safety timeout so headless/hidden-tab renders never ship blank).
- Hero mark has a slow float; sticky nav gains a border on scroll.
- Full `prefers-reduced-motion: reduce` fallback (instant, no transforms).
