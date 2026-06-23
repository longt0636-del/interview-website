@AGENTS.md

# Frontend Design Rules

## Brand Assets
- Always read `brand_assets/brand-guidelines.md` before writing any frontend code.
- Use exact brand hex values — never default Tailwind palette (blue-600, purple-500, etc.).
- CSS variables are defined in `globals.css`: `--navy`, `--teal`, `--teal-light`, `--mint`, `--amber`, `--ink`, `--off-white`.

## Typography
- Headings (H1, H2): `font-serif` class (Playfair Display)
- Body, buttons, labels: `font-sans` class (Inter)
- Scores, numbers, stats: `font-mono` class (DM Mono)
- Never use the same font for headings and body.

## Colour Rules
- Primary CTA buttons: `background: var(--teal)` with white text
- Page background: `var(--off-white)` — not plain white or gray-50
- Headings on light bg: `color: var(--navy)`
- Score numbers: `color: var(--amber)` in `font-mono`
- Info callout sections: `background: var(--mint)` with navy text
- Never use Amber as a body text background

## Anti-Generic Guardrails
- Shadows: use `box-shadow: 0 2px 12px rgba(11,61,92,0.08)` — color-tinted, not flat gray
- Hover states: every interactive element needs hover + focus-visible + active
- Transitions: only `transform` and `opacity` — never `transition-all`
- Spacing: consistent — card padding 24px, section padding 96px vertical
- Border radius: cards use 16px (rounded-2xl), tags use 999px (rounded-full)

## Local Server
- Dev server runs via `npm run dev` at `http://localhost:3000`
- Always test on localhost before any deploy
