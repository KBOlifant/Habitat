# Habitat

Habitat is a calm habit-change companion built with Expo and React Native. Users choose a habit to work on, complete a daily check-in, log triggers, and watch their current streak drive the growth of a virtual bonsai.

The app uses Firebase Authentication and Cloud Firestore as its backend. The current implementation is contained in `frontend/`; `backend/` is reserved for future server-side work.

## Features

- **Authentication**: Email/password sign-up and sign-in through Firebase Auth.
- **Onboarding**: Users enter their name and choose the habit they want to change.
- **Daily check-in**: A swipeable four-card reflection sequence. If a relapse trigger exists, the deck adds a final follow-up card asking whether the trigger affected the user and allowing an optional note.
- **Bonsai progress**: Consecutive checked-in days are converted into a `0` to `1` growth value for the bonsai illustration.
- **Trigger Log**: Users can create, inspect, and delete trigger records. Relapse triggers can receive a nested follow-up response from the check-in deck.
- **Check-In Notes**: Displays notes written during check-ins and notes attached to relapse follow-ups. Notes can be deleted without deleting their parent trigger.
- **Progress Dashboard**: Shows current streak, resisted triggers, relapses, the last 30 days, bonsai growth stages, and milestones.
- **Daily quote**: Home fetches the daily quote from the ZenQuotes API and uses a local fallback if the request fails.
- **Developer tools**: Development builds include date time travel, simulated completed days, duplicate protection, and a button to delete all daily check-ins from Firestore.
- **Navigation**: Persistent tabs provide quick page switching. Tab history and custom back buttons preserve the previous destination when possible.

## Technology

| Area | Technology |
| --- | --- |
| App | Expo SDK 54, React Native 0.81, React 19 |
| Routing | Expo Router with a root Stack and tab navigator |
| Styling | NativeWind and Tailwind CSS |
| Fonts | Fraunces via `@expo-google-fonts/fraunces` |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Icons | Lucide React Native and Material Icons |
| Quotes | ZenQuotes API |

## Project Structure

```text
frontend/
  app/
    (tabs)/             Home, Check-In, Triggers, Dashboard, and Notes routes
    lib/                Firebase, auth, progress, navigation, and storage helpers
    _layout.tsx         Root Stack and global font loading
  components/           Reusable screens, cards, headers, modals, and controls
  constants/            Theme and typography tokens
  assets/               Images and app assets
  package.json
backend/                 Currently empty; reserved for future backend services
```

## Firestore Data Model

All application data is scoped to the authenticated user:

```text
users/{uid}
users/{uid}/addiction_record/{recordId}
users/{uid}/addiction_record/{recordId}/triggerLog/{triggerId}
users/{uid}/check_in_record/{checkInId}
users/{uid}/plant_state/current
```

Trigger documents contain `name`, `reason`, `intensity`, `relapsed`, and `loggedAt`. A relapse follow-up may be stored on the same trigger document:

```ts
followUp: {
  wasTriggered: boolean;
  note?: string;
  createdAt: string;
}
```

Completed daily check-ins contain `checks`, `completedAt`, `daily_check`, and `has_relapsed`. Check-in notes are stored as `note` on the check-in document. The Notes page reads both note locations.

Progress is calculated from check-ins and trigger logs by `frontend/app/lib/progress.ts`. `plant_state/current` is only a cache of derived progress and is not the source of truth.

## Requirements

- Node.js 20 or newer is recommended.
- npm
- An Expo-compatible development device, emulator, or browser
- A Firebase project with Firestore enabled

## Setup

From the repository root:

```bash
cd frontend
npm install
```

Create the local environment file from the template:

```bash
copy .env.example .env
```

On macOS/Linux, use `cp .env.example .env` instead.

Fill in `frontend/.env` with values from Firebase Console under **Project settings > Your apps > Web app**. Expo exposes variables to application code only when they use the `EXPO_PUBLIC_` prefix.

Required Firebase variables:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

For Google sign-in, configure the appropriate OAuth client IDs:

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
```

Enable the required providers in Firebase Console under **Authentication > Sign-in method**. Create Firestore and add rules that allow an authenticated user to access only their own `users/{uid}` data. Do not commit `.env`; use `.env.example` as the shareable template.

## Running the App

Run these commands from `frontend/`:

```bash
npm start
npm run android
npm run ios
npm run web
```

Use `npm start` for the interactive Expo server. After it starts, press `a` for Android, `i` for iOS, or `w` for web. You can also scan the QR code with Expo Go when compatible.

The root route displays an animated splash while Firebase authentication resolves. Signed-in users are sent to Home; signed-out users are sent to Authentication.

## Developer Workflow

Development-only check-in controls are rendered when `__DEV__` is true. Open the Check-In tab to use them:

1. Move the selected date with the time-travel arrows.
2. Choose **Complete this day** to write a simulated complete check-in to Firestore.
3. Use **Clear all check-ins** to delete every document under the current user’s `check_in_record` collection and reset local progress.

The simulated date is stored as `completedDate`, and duplicate dates are rejected. These controls are not rendered in production builds.

## Validation

```bash
npx tsc --noEmit
npm run lint
```

## Roadmap

- Push notifications and daily check-in reminders
- Progress history export
- Additional bonsai themes
- Automated tests and stronger Firestore security rules
- Server-side proxy or caching for the quote service

## Contributing

1. Create a feature branch.
2. Keep changes focused and follow the existing Expo/React Native patterns.
3. Run TypeScript and lint checks before opening a pull request.
4. Describe user-facing behavior and any Firestore schema changes.

## License

under the MIT License. See [LICENSE](./LICENSE) for more information.

<div align="center">
Made with 🌱 by Keabetswe Olifant
</div>