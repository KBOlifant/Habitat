# Templates Skill

Purpose
- Provide the AI with practical page and component templates (code-first) to scaffold new features quickly.

High-level page templates
- Onboarding step page: header, content area, continue button, progress indicator.
- Habit detail page: header, progress section, activity log, CTA to edit.
- Grid selection page: responsive grid of habit cards with selection state and "other" input.
- Modal form: standardized modal layout with title, body inputs, actions.
- Activity feed: chronological list with grouped days and lazy-loading.

Component templates
- Card: image/icon, title, subtitle, status badge, onPress handler.
- Header: back button (optional), title, action icons.
- Empty-state: illustration, message, primary and secondary actions.
- Swipeable list item: left/right actions, long-press support.

Scaffolding output expected
- For each template, return a file path under `app/` or `components/`, a TypeScript functional component scaffold, and a short usage example.
- Provide mock props and sample test cases for each template.

Developer checklist for generated templates
- Ensure imports align with repo (use `themed-text`, `themed-view`, and shared hooks).
- Add a short README or code comment describing data needs and edge cases.
- Include accessibility attributes and responsive notes for web.
