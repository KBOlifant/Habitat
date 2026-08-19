# 🌱 Habitat

> **A habit-breaking companion app where quitting bad habits grows a living bonsai.**
> Dark green, mindful, and built for landscape-only reflection.

---

## Overview

Habitat helps users quit habits smoking, drinking, doomscrolling, gambling, nail biting, and more, by tying daily progress to the growth of a virtual bonsai tree. Every day the user checks in through a swipeable card deck, logs urges as they happen, and watches their streak translate into visible, physical growth. The app is locked to **landscape mode**, treating each session like a small, deliberate ritual rather than a quick phone glance.

---

## Core Concept

- **Main object**: Break a habit, one day at a time.
- **Main feature**: A daily swipe-card check-in swipe right for "no urge," left for "strong urge" that "feeds" Your Bonsai plant.
- **Restriction**: Landscape-only orientation, forcing a slower, more intentional interaction than a typical vertical scroll app.

---

## Key Features

### 🏠 Home
Landing dashboard on open. Greets the user by name and time of day, displays current streak ("Day 3"), a live illustration of the bonsai at its current growth stage, a rotating motivational quote, and a countdown to the next milestone. Includes quick-access tiles for the daily check-in, trigger log, and progress, plus a running "today's reflection" prompt.

### 🔄 Daily Check-in
A 5-card swipeable deck, one question per card (e.g. *"Are you feeling an urge to engage in your habit right now?"*). Swipe or tap to answer — no urge / strong urge. Completing the deck each day counts as feeding the bonsai and extends the streak.

### ⚠️ Trigger Log
A log of urges and triggers the user records outside the daily check-in. Empty state reads *"No triggers logged yet"* until the first entry. A floating "+" button adds a new log  capturing what set off a craving in the moment.

### 📊 Progress
The stats hub. Top row shows streak count, times resisted, and relapses. A 30-day grid visualizes each day as checked-in, relapsed, or missed. Below that, a **Tree Growth** ladder tracks bonsai stages (Dormant Seed → First Sprout → Taking Root → Young Sapling → Growing Bonsai → Formed Bonsai → Ancient Wisdom), each unlocking at a day threshold. A **Milestones** list marks streak achievements (3 days, one week, two weeks, one month, etc.) with countdowns to the next unlock.

### 🌳 Onboarding — Plant Your Seed
First-time flow where the user selects the habit they're breaking (Smoking, Social media, Alcohol, Sugar, Gambling, Shopping, Nail biting, Caffeine, Procrastinating, Vaping, or a custom "Something else…"). Confirming plants the seed that becomes their bonsai.

### 🧪 Dev — Time Travel
A developer-only widget on Home that lets the streak be simulated forward or backward by day, for testing growth stages and milestone logic without waiting in real time.

---

## UI & Brand Style

- **Palette**: Deep charcoal-green backgrounds with muted sage and moss accents; warm dusty-pink used sparingly for primary actions (e.g. the check-in CTA).
- **Tone**: Calm, botanical, low-stimulation, soft rounded cards, generous spacing, minimal iconography (leaf, shield, chart bars, trigger warning).
- **Orientation**: Landscape-locked throughout, reinforcing a deliberate "sit down and check in" pace over passive scrolling.
- **Iconography**: Line-style icons (home, check-in, triggers, progress) anchor a persistent bottom nav.

---

## Tech Stack

| Layer          | Technology   | Purpose                          |
| -------------- | ------------ | --------------------------------- |
| **Frontend**   | React-Native        | Mobile UI, swipe interactions     |
| **Backend**    | Firebase        | Streak logic, user data           |
| **Database**   | Firestore       | Persisting streaks, triggers, logs |
| **Auth**       | Firebase Auth       | User accounts                     |
| **Deployment** | Playstore (Potentially)        | Hosting / distribution            |

*(Fill in once the stack is finalized — happy to update this table.)*

---

## Getting Started

### Prerequisites
- *TBD — add framework/runtime versions here*

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/habitat.git
cd habitat

# Install dependencies
npm install

# Start the app
npm start
```

---

## Roadmap
- [ ] Push notifications for daily check-in reminders
- [ ] Social/community accountability features
- [ ] Export progress history
- [ ] Additional bonsai skins per habit type

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
style:    Visual/styling changes (no logic change)
refactor: Code restructure
docs:     Documentation only
chore:    Build, config, tooling
```

---

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

---

<div align="center">
Made with 🌱 by Keabetswe Olifant
</div>