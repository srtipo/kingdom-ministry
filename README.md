# Kingdom ministry

Mobile app built with **React Native (Expo)** for Jehovah's Witnesses to manage return visits and Bible study courses in their ministry.

## Tech Stack

- **Framework:** React Native 0.81 + Expo SDK 54
- **Routing:** Expo Router (file-based, tabs + stack)
- **State:** TanStack React Query
- **DB:** expo-sqlite (local, with migrations)
- **UI:** React Native Paper + styled-components + styled-system
- **Validation:** Zod 4
- **Testing:** Jest + Testing Library React Native + alasql (SQLite mock)

## Architecture

Clean Architecture with 3 layers:

```
src/
  core/            -- Entities, repository interfaces, use cases
  data/            -- Implementations (SQLite), migrations
  presentation/    -- Components, hooks, screens, design system
  di/              -- Dependency injection container (manual)
```

## Features

- CRUD for return visits and Bible study courses
- Search by name/address with debounce
- Date filters: Today, Tomorrow, Next Week, Past, Custom
- Color-coded next visit date (red overdue, yellow soon, green future)
- Phone call and WhatsApp contact from the app
- Bottom sheet modal with swipe gesture for create/edit
- Light/dark theme

## Scripts

```bash
pnpm start          # Start Expo dev server
pnpm android        # Start on Android
pnpm ios            # Start on iOS
pnpm web            # Start on web
pnpm test           # Run tests with Jest
pnpm lint           # ESLint
```

## Environment variables

Copy `.env.example` to `.env`:

```
EXPO_PUBLIC_DB_NAME=ministery.db
```
