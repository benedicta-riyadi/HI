# Design

## Theme

"Persimmon & Ink" — an elegant light theme with Gen-Z energy. A crisp, near-white
canvas (not cream — too light and low-chroma to read as the SaaS-paper default)
lets one committed signature do the work: a juicy **persimmon-coral** that
carries CTAs, links, and highlights, set against a warm espresso **ink** for
type. The energy comes from the persimmon pop and an expressive serif display;
the elegance comes from restraint everywhere else and a near-monochrome base.
Color strategy: **committed** — persimmon anchors primary actions, active states,
and accents; everything else is ink, white, and hairlines. Deliberately *not*
the purple/violet AI-gradient reflex.

Captured from `piohub-design-system.html` (the component spec). Re-run
`$impeccable document` to refresh if the tokens drift.

## Color (OKLCH)

| Role            | Hex        | OKLCH (approx)            | Notes |
|-----------------|------------|---------------------------|-------|
| `--bg`          | `#FBFAF8`  | `oklch(0.985 0.003 80)`   | Soft near-white canvas. Reads as clean white, not cream. |
| `--surface`     | `#FFFFFF`  | `oklch(1 0 0)`            | Cards/panels — float a touch brighter than canvas. |
| `--surface-2`   | `#F4F1ED`  | `oklch(0.955 0.005 80)`   | Insets, code chrome, tab track. |
| `--ink`         | `#221E1A`  | `oklch(0.24 0.008 60)`    | Headings + strong body. ~13:1 on white. |
| `--muted`       | `#6E665E`  | `oklch(0.50 0.008 70)`    | Secondary text. ≥4.5:1 on bg. |
| `--faint`       | `#968D83`  | `oklch(0.63 0.010 70)`    | Meta / tertiary only (timestamps, labels). |
| `--border`      | `#E8E3DD`  | `oklch(0.92 0.006 70)`    | Hairlines, dividers. |
| `--accent`      | `#EE6C45`  | `oklch(0.70 0.16 40)`     | Persimmon. Brand fill — pairs with **ink text**, not white. |
| `--accent-deep` | `#C24A28`  | `oklch(0.56 0.15 38)`     | Links / accent text on white / hover. ≥4.5:1 on white. |
| `--accent-soft` | `#FBE6DD`  | `oklch(0.93 0.030 45)`    | Tint surfaces, soft badges. |
| `--destructive` | `#D23B2E`  | `oklch(0.57 0.19 27)`     | Crimson — held at a redder hue so it never reads as the brand. |

Contrast checked: ink/bg ≈ 13:1, muted/bg ≈ 5:1, ink on accent ≈ 7:1,
accent-deep on white ≈ 4.6:1, white on destructive ≈ 4.6:1. Accent (hue 40) and
destructive (hue 27) are separated in hue + lightness so persimmon and "error"
never collide. Role/status tags pair color with a text label or icon.

## Typography

Paired on a contrast axis (serif display + sans body), not two similar sans.

- **Display (h1–h3, big numbers):** **Fraunces** (variable, optical sizing on).
  Expressive high-contrast serif — elegant with a little wonk, the Gen-Z
  editorial voice. Weight 500–600, tracking ~-0.01em, `text-wrap: balance`.
- **Body / UI:** **Manrope** (variable). Clean humanist sans — buttons, inputs,
  body, most UI text. Line length capped ~65ch, `text-wrap: pretty` on prose.
- **Mono / utility:** **JetBrains Mono** — section labels, tags, stat
  micro-labels, kbd. The functional taxonomy of the system, not decoration.
- Hero clamp max ~68px (well under the 96px ceiling).

Loaded from Google Fonts (Fraunces / Manrope / JetBrains Mono). Self-host on
Latin subset before production to kill the third-party dependency and layout
shift.

## Components

- **Buttons:** `default` (persimmon fill, ink text), `outline` (hairline + ink),
  `secondary` (accent-soft tint), `ghost`, `destructive` (crimson, white text).
  Radius 10px (lg 12). No border + wide-shadow pairing; resting elevation is a
  1px shadow, hover lifts.
- **Inputs:** 10px radius, 1.5px border, focus = accent border + 3px accent ring.
  Error (crimson) and disabled states defined; placeholders meet ≥4.5:1.
- **Role tags & badges:** one harmonized tint formula — soft same-hue bg,
  mid-dark same-hue text, hairline border. Pill radius. Emoji-led role tags for
  personality. (Replaces the old rainbow.)
- **Cards:** 16px radius (never the 24–32px over-round). Resting = hairline +
  faint shadow; hover = accent border, lift, defined shadow.
- **Stat tiles:** one inverted ink tile per row for emphasis instead of a glow.
- **NavBar, dropdown, dialog, tabs, toasts, avatars, skeleton, empty states,
  progress, charts** — all specified in `piohub-design-system.html`.

## Layout

- Doc/spec uses a sticky left sidebar grouped Foundations / Components / Patterns
  + a max-1000px main column. App shell uses the `NavBar` component.
- Varied vertical rhythm; sections breathe at different scales.
- Flexbox for 1D rows, Grid only where genuinely 2D
  (`repeat(auto-fit, minmax(...))` for responsive grids).
- Semantic z-index scale: sticky → dropdown → modal → toast → tooltip.

## Motion

- Ease-out curves (`cubic-bezier(.2,.8,.2,1)`). No bounce/elastic.
- Scroll reveals **enhance an already-visible default** — content renders without
  JS; reveal only adds a brief translate/fade when JS + motion are allowed, with
  a safety timeout so headless / hidden-tab renders never ship blank.
- Hover micro-interactions: cards lift, tags nudge, buttons raise.
- Full `prefers-reduced-motion: reduce` fallback — instant, no transforms.
