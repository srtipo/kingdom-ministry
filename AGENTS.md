# AGENTS.md

Concise guidance for OpenCode sessions working in this repo. Add only what an agent would otherwise miss.

## Project

`revisitas` — React Native (Expo SDK 54) app for Jehovah's Witnesses to manage return visits and Bible study courses. Spanish-first UI ("Revisitas", "Cargando Base de Datos…"). Upstream remote is `srtipo/kingdom-ministry` (package name on npm-local is `revisitas`).

## Stack

- React Native 0.81.5 + Expo SDK 54 (`expo` ~54.0.33), React 19.1, TypeScript 5.9
- Routing: `expo-router` 6 (file-based, tabs + stack)
- State: TanStack React Query 5
- DB: `expo-sqlite` with hand-rolled versioned migrations
- UI: `react-native-paper` + `styled-components` + `styled-system` + `dayjs`
- Validation: `zod` 4
- Testing: Jest + `jest-expo` + `alasql` (in-memory SQLite stand-in for tests)
- Tooling: ESLint 9 (`eslint-config-expo/flat`), pnpm

`app.json` enables `newArchEnabled: true` and experiments `{ typedRoutes: true, reactCompiler: true }` — avoid libs that don't support these.

## Repo layout (load-bearing only)

- `app/` — Expo Router file routes. `app/_layout.tsx` wires `GestureHandlerRootView → Suspense → QueryClientProvider → SQLiteProvider → PaperProvider → ThemeProvider → Stack`. Tabs: `app/(tabs)/{visit,explore}.tsx`. Visit detail: `app/(tabs)/visit/[id].tsx`.
- `src/core/modules/visits/` — domain interfaces (`*.interface.ts`) and use-case handlers (`*.handler.ts`).
- `src/data/database/` — `db.ts` (migrator), `migrations.ts`, `SqliteConnection.ts` (singleton), `use-db.ts` (`useSQLiteContext` re-export), `sqlite-test-adapter.ts` (alasql mock).
- `src/data/modules/visits/` — repositories + SQL↔domain mappers.
- `src/di/visits/container.ts` — manual DI; **instantiates `getDatabase()` at module load**.
- `src/presentation/` — components, hooks, scenes, UI primitives, `libraries/` (incl. `crypto.ts` → `expo-crypto.randomUUID`).

`@/*` path alias maps to repo root (`tsconfig.json`, `jest.config.js`).

## Commands

Run with `pnpm` (lockfile is `pnpm-lock.yaml`; not npm or yarn).

- `pnpm start` / `pnpm android` / `pnpm ios` / `pnpm web` — Expo dev server (and target platform).
- `pnpm test` — full Jest run.
- `pnpm test:visits` — `jest --testPathPattern='modules/visits'`.
- `pnpm test:attendance` — `jest --testPathPattern='attendance'`.
- `pnpm lint` — `expo lint`.
- **No `typecheck` script** — run `npx tsc --noEmit` directly when needed.
- `pnpm reset-project` is wired in `package.json` but `scripts/reset-project.js` does not exist; ignore unless you add the script.

## Architecture rules

- Strict Clean Architecture: `core` defines interfaces, `data` implements them (SQLite), `presentation` consumes via hooks, `di` wires everything.
- UI never imports repositories directly — it goes through `src/di/visits/container.ts` exports, e.g. `createVisitsHandler`, via React Query hooks under `src/presentation/.../hooks/`.
- Adding a new use case: define the interface in `core/modules/.../interfaces/`, implement the handler in `core/modules/.../handlers/`, add a repository method if needed, then expose the handler in `src/di/visits/container.ts`.
- New architecture layers (modules other than `visits`) should follow the same `core/data/presentation/di` split.

## UI library rule

- Preferred library: **`react-native-paper`**. It is the only UI lib we want bleeding into the project.
- **Never import `react-native-paper` directly from app code** (scenes, forms, modals, hooks, etc.). All Paper components must be wrapped first in `src/presentation/ui/` (one folder per primitive: `buttons/`, `cards/`, `chips/`, `texts/`, `inputs/`, `modals/`, etc.) — see `ui-button.tsx`, `card.tsx`, `text.tsx` for the pattern (Paper component + `styled-components` + `styled-system` props, then re-exported under our own name).
- App code imports the wrapper (e.g. `import { Button } from "@/src/presentation/ui/buttons/ui-button"`), not `Button` from `react-native-paper`.
- Reason: the wrapper layer is the swap point — if we ever migrate to another UI lib (e.g. Tamagui, NativeBase, custom), only the files in `src/presentation/ui/` change; scenes/forms/hooks stay untouched.
- New primitive → new file under `src/presentation/ui/<category>/<kebab>.tsx` that re-exports a styled Paper component under our naming.

## Database

- Migrations live in `src/data/database/migrations.ts` as a plain object keyed by integer (`1`, `2`, `3`, …). To add a schema change, append the next integer key; `migrateDbIfNeeded` in `db.ts` runs them in order and tracks progress in a `db_versions` table it creates on first run.
- Migrations are **append-only**: never edit a migration that has been shipped. To change schema, add a new key with the next integer.
- Migration SQL must be **idempotent**: `CREATE TABLE IF NOT EXISTS`, `INSERT OR IGNORE`, `WHERE NOT EXISTS`. Never `DROP TABLE` in a shipped migration — it destroys user data.
- Default seed rows (e.g. notification configs) use **stable string IDs** (`'default-1d'`, `'default-1h'`) so the UI can find them by ID and edit/remove them without losing the reference. `time` is stored in **minutes** (1d = `1440`, 1h = `60`).
- The runtime DB name comes from `process.env.EXPO_PUBLIC_DB_NAME` (see `app/_layout.tsx`'s `SQLiteProvider` and `SqliteConnection.ts`).
- SQL values cross the boundary via mappers (`src/data/modules/visits/mappers/`) — keep domain types in camelCase (`nextVisit`) and SQL columns snake_case (`next_visit`).

## Testing

- Tests are colocated in `__tests__/` next to source.
- Naming: `*.test.ts(x)` for unit, `*.int.test.ts(x)` for integration.
- Integration tests use `createTestDb()` from `src/data/database/sqlite-test-adapter.ts` (alasql-backed) and **must not** call the migrator — pass a hand-written `SCHEMA` string.
- `generateUUID` from `src/presentation/libraries/crypto.ts` is mocked with a `fixed-uuid-N` counter pattern in integration tests; reset the counter in `beforeEach`.
- Preset is `jest-expo`; module alias `@/*` → repo root.

## Env / config

- `.env` is gitignored; only `.env.example` is committed. Copy it to `.env` and set `EXPO_PUBLIC_DB_NAME=<file>.db`.
- `env.d.ts` augments `NodeJS.ProcessEnv` for that var.
- `expo-env.d.ts` is auto-generated by Expo — never edit; it is gitignored.
- `pnpm-workspace.yaml` exists and declares `allowBuilds: { unrs-resolver: true, dtrace-provider: false }` — the pnpm 11 form for build-script approval. `unrs-resolver` is the package whose `napi-postinstall` fetches a native `.node` binary used by ESLint resolvers; `dtrace-provider` is a transitive of `bunyan` (Expo CLI) whose `node-gyp || node suppress-error.js` no-ops on Windows. This is a single-package setup, not a monorepo.
- `.npmrc` uses `node-linker=hoisted` + `shamefully-hoist=true` + `auto-install-peers=true` (required for RN/Expo).
- `@react-native-community/datetimepicker` is installed from `github:react-native-community/datetimepicker` (not npm) — be careful when bumping.
- `babel.config.js` only loads `react-native-paper/babel` in `production`.

## Gotchas

- `getDatabase()` is called at module load by `src/di/visits/container.ts`. Importing the container from tests or non-Expo contexts will hit the native binding. In tests, build handlers with `createTestDb()` directly (see `visits.repository.int.test.ts`).
- `app/_layout.tsx` imports `@/src/presentation/hooks/use-color-scheme.web` on purpose; there is also a `use-color-scheme.ts` (native). Keep the platform split when touching the hook.
- `tabBarIcon` for the second tab uses `MaterialCommunityIcons` while the visit tab uses `MaterialIcons` — don't swap them.
- No CI workflows (`.github/` is empty), no pre-commit hooks. Verification is local only.

## Branch / commit / PR

- Default branch: `master`. All work goes through PRs into `master`.
- Branch naming: `<type>/<kebab-description>` with one of `feat`, `refactor`, `fix`, `chore`, `docs` (mirrors existing `feat/edit-visit`, `refactor/attendance-form-and-theme-colors`, `refactor/visit-color`).
- Commit messages: Conventional Commits (`feat: …`, `refactor: …`, `fix: …`). Spanish descriptions are common and fine.
- PR title follows the same `<type>: <description>` shape; no template is enforced.
- Typical flow: branch off `master`, push, open PR, address review comments with `resolve comments` style follow-up commits, then squash-merge via the GitHub UI (existing history shows this pattern).
- No `gh` automation is configured in this repo.

## References

- `README.md` — feature list, scripts, env var.
- `app.json` — Expo config (new arch, plugins, experiments).
- `src/data/database/migrations.ts` — schema source of truth.
- `.env.example` — env var keys.
- `revisitas-ui.op` — Pencil design file; do not edit from code, open in Pencil.
