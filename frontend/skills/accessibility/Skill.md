# Accessibility Skill

Purpose
- Ensure AI-generated pages and components meet practical accessibility standards for mobile and web.

Platform notes
- Mobile (React Native): Provide `accessibilityLabel`, `accessibilityRole`, and ensure touch targets >= 44x44 points.
- Web (React Native for Web): Ensure keyboard focus, logical tab order, and ARIA where appropriate.

Rules and checks
- Color contrast: All text must meet WCAG AA (contrast ratio >= 4.5:1 for normal text).
- Focus management: Dialogs and modals should trap focus; return focus to trigger on close.
- Semantic elements: Use appropriate roles for interactive controls.
- Hit areas and spacing: Ensure tap targets are large enough and spacing avoids accidental taps.
- Motion: Prefer reduced-motion-friendly animations and obey system preferences.

Testing guidance
- Provide simple accessibility test checklist (use `@testing-library/react-native` and axe-web where applicable).
- Recommend manual smoke checks: keyboard navigation on web, screen reader flow on iOS/Android.

Deliverables from AI
- For each generated component/page, include required accessibility props and a short testing checklist.
- Flag potential accessibility tradeoffs and offer alternatives.
