# Design Tokens Skill

Purpose
- Give the AI a single source of truth for visual tokens (colors, spacing, typography, radii) to keep new pages consistent.

Where tokens live
- Primary source: `constants/theme.ts` (update if missing).
- Tailwind/nativewind mapping: `tailwind.config.js`.

Required token categories
- Colors: primary, secondary, background, surface, success, warning, danger, text-primary, text-secondary, muted.
- Spacing: base unit (e.g., 4px) and scales (xs, sm, md, lg, xl).
- Typography: font families, sizes, weights, line heights for H1/H2/H3/body/caption.
- Radii: small, medium, large.
- Elevation/shadows: platform-aware presets.

AI outputs expected
- A JSON or TypeScript `export const tokens = { ... }` snippet that can be copied into `constants/theme.ts`.
- Tailwind config suggestions (keys and example mappings) for `tailwind.config.js` to use tokens consistently.
- Example usage snippets: `themed-text`, `themed-view` examples using tokens.

Constraints
- Keep tokens minimal but expressive; prefer reusing existing names in the repo.
- When proposing changes to `tailwind.config.js`, provide a diff and migration notes for existing classes.
