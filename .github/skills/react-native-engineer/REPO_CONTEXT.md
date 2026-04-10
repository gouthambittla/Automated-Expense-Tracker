# React Native Repo Context

Use this file as the repo-specific grounding for frontend work.

Current stack detected from `Frontend/package.json`:

- Expo `~54.0.33`
- React Native `0.81.5`
- React `19.1.0`
- TypeScript `~5.9.2`
- React Navigation `@react-navigation/native` `^7.1.28`
- Bottom tabs and native stack navigation
- React Native Paper `^5.15.0`
- Reanimated `~4.1.1`
- AsyncStorage `^2.2.0`
- Zustand `^4.4.0`
- `expo-image`, `expo-secure-store`, `expo-splash-screen`, `expo-system-ui`

Observed repo patterns:

- Screens live under `src/screens/`.
- Navigation is defined in `src/app/navigation/`.
- Theme colors and shadows are defined in `src/theme/GlobalTheme.ts`.
- Current UI uses large rounded surfaces, Paper theme tokens, and explicit layout styling.
- `Analytics.tsx` currently renders KPI cards but no real graphing component.
- `AddExpense.tsx` uses responsive sizing with `useWindowDimensions`, form validation in the component, and server synchronization after writes.

Practical implications:

- Do not assume chart libraries already exist.
- Do not assume Tailwind, NativeWind, or styled-components are available.
- Prefer Paper theme colors and existing screen composition patterns.
- Keep TypeScript types explicit when introducing shared UI data models.
