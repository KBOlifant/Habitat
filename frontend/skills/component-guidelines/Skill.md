# Component Guidelines Skill

Purpose
- Provide an AI with conventions and patterns for building reusable components consistent with the Habitat codebase.

Key conventions
- File placement: put shared UI components under `components/` and feature-scoped components under nested folders (e.g., `components/CheckIn/`).
- Naming: PascalCase for component files and exported component names (e.g., `CheckInCard.tsx` -> `CheckInCard`).
- Props: Prefer explicit prop objects with clear types and optional fields documented in the JSDoc.
- Styling: Use nativewind/tailwind class strings and `themed-view`/`themed-text` where color tokens are needed.
- Hooks: Use existing hooks (`use-theme-color`, `use-color-scheme`) for theme awareness.

Patterns to follow
- Presentational vs container: Keep dumb UI in presentational components and logic in hooks or containers.
- Accessibility: All interactive components expose `accessibilityLabel` and are reachable by keyboard on web.
- Tests: Export small pure functions where possible and add unit tests for behavior.

Examples for AI to emit
- Card component scaffold with props, example usage, and Tailwind classes.
- Header component with optional back button and title prop.
- Swipeable list item using existing `swipeable-card.tsx` patterns.

Developer notes for PRs
- Prefer reusing existing components; if creating a new shared component, add it to `components/` with tests and a small README.
- Keep changes localized and add story/mocks for major UI pieces.
