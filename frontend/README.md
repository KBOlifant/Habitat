# Habitat

Habitat is an Expo / React Native habit-recovery app. Firebase is the backend-as-a-service:

- Firebase Authentication handles email/password and Google sign-in.
- Cloud Firestore stores user profiles and app records.

## Firebase data

- `users/{uid}` — account profile
- `users/{uid}/addiction_record/{recordId}` — selected habit
- `users/{uid}/addiction_record/{recordId}/triggerLog/{triggerId}` — trigger entries and follow-up notes
- `users/{uid}/check_in_record/{checkInId}` — daily swipe/check-in records and optional notes
- `users/{uid}/plant_state/current` — derived bonsai progress cache

The Firestore and Firebase Auth calls live in `functions/`, grouped by feature (`auth`, `users`, `swipes`, `triggers`, and `progress`). Screens and components import those functions rather than calling Firebase SDK methods directly. `functions/firebase.ts` only initializes Firebase for the data layer.

## Run locally

1. Install dependencies with `npm install`.
2. Set the required `EXPO_PUBLIC_FIREBASE_*` values in `.env` (see `.env.example`).
3. Start Expo with `npm start`.

The Expo Router routes are in `app/`; the mobile navigation maps Home, Check-in, Triggers, Progress, and Field Notes to the bottom bar.
