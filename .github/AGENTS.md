# Project Guidelines

## Workspace Scope

This repository uses `.github/AGENTS.md` as the workspace instruction file. Keep repo-wide agent guidance here and avoid adding a parallel `copilot-instructions.md`.

## Architecture

- `Frontend/` is an Expo React Native app built with TypeScript, React Navigation, React Native Paper, Zustand, and Expo modules.
- `Backend/` is a Node.js ESM Express API using PostgreSQL via `pg`, JWT auth, and direct SQL schema management.
- `.github/skills/` contains repo-specific skill packs for frontend, backend, AI extraction, and product planning.
- `.github/agents/` contains focused custom agents that should map cleanly to those skills.

## Agent Routing

- Use `react-native-engineer` for mobile UI, screenshot-to-screen builds, navigation, forms, analytics visuals, charts, and Expo integrations.
- Use `backend-engineer` for Express routes, controllers, auth, SQL queries, validation, middleware, and schema-related changes.
- Use `ai-engineer` for SMS or phone-message extraction, structured model outputs, AI-to-DB mapping, confidence and review flows, and evaluation planning.
- Use `product-manager` for feature scoping, PRDs, acceptance criteria, sequencing, dependencies, and cross-functional delivery planning.

## Conventions

- Prefer existing project dependencies before adding new ones.
- Keep changes aligned with the current folder structure unless there is a concrete architectural reason to change it.
- For frontend work, use theme tokens and established layout patterns from `Frontend/src/theme/GlobalTheme.ts` and existing screens.
- For backend work, prefer parameterized SQL, explicit validations, and predictable JSON response shapes.
- For AI features, validate model output before persistence and route uncertain results to user review.

## Build And Test

- Frontend install and run commands are defined in `Frontend/package.json`.
- Backend development and runtime commands are defined in `Backend/package.json`.
- When agents make runnable code changes, they should run the smallest relevant verification command that the current repo supports.
