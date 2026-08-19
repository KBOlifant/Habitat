# Page Design Skill

Purpose
- Guide an AI to design and scaffold new pages for the existing Habitat frontend (Expo + React Native / React Native for Web + TypeScript + Tailwind/nativewind).

Inputs the AI should use
- Project structure and existing components under `app/`, `components/`, `constants/`, and `assets/`.
- Existing design tokens in `constants/theme.ts` and `tailwind.config.js`.
- Navigation pattern: pages live under `app/` and (tabs) layout is used for main screens.

Outputs expected
- A prioritized list of suggested pages (route path and human-friendly title).
- Per-page spec: purpose, primary components to reuse, required props and state, data schema, and expected interactions.
- Example file scaffolding: file path, component name, TypeScript component skeleton, and simple Tailwind-based styles.
- Mock data and story examples that can be used for development.
- Accessibility notes and responsive/web variants where relevant.

Constraints and conventions
- Use Functional React components with TypeScript.
- Keep styling consistent with nativewind/tailwind classes and `use-theme-color` hooks.
- Reuse existing components (e.g., `check-in-card.tsx`, `swipeable-card.tsx`, `bonsai-progess-screen.tsx`) where appropriate.
- Avoid adding new heavy dependencies.

Step-by-step generation process for the AI
1. Analyze `app/` routes and current screens to identify gaps and logical next pages.
2. Propose 3–8 new page ideas, ordered by user value (e.g., Onboarding improvements, Habit detail, Progress deep-dive, Trigger log improvements).
3. For each page, produce a spec with props/state/data needs and a minimal code scaffold placed under `app/` with suggested filename and component name.
4. Provide example mock data and a visual wireframe description (list of components and layout order).
5. Output a PR-ready checklist: files to add, components to reuse, tests to create, and accessibility checks.

Example output (Habit detail page)
- Route: `/habit/[id]`
- Files: `app/habit/[id].tsx`
- Component: `HabitDetailScreen`
- Reused components: `progress-header.tsx`, `stats-row.tsx`, `last-30-days.tsx`
- Mock data: { id, name, streak, milestones, recentTriggers }
- Interactions: swipe-to-log, open modal for editing habit, show milestone progress.

Notes for reviewers
- Keep the scaffolds minimal and focused on reuse.
- Include a brief README snippet in the PR describing UX intent and sample screenshots/mockups.
