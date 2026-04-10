# API And SQL Standards

## API Design

1. Use resource-oriented routes and stable JSON response shapes.
2. Validate input at the edge and normalize values before writing to the database.
3. Keep auth-derived values, such as user IDs, out of client-controlled payloads.
4. Return machine-usable error messages and appropriate HTTP status codes.
5. Add request logging that helps debugging without leaking secrets or sensitive payloads.

## SQL Standards

- Always use placeholders such as `$1`, `$2`, and pass values separately.
- Prefer explicit `INSERT INTO table (columns...) VALUES (...)` over implicit order assumptions.
- Keep timestamps and currency handling consistent.
- Use `JSONB` for model metadata or raw AI payloads, but validate the structure before persisting.
- Add indexes deliberately when query patterns justify them.

## Error Handling Standards

- Pass unexpected errors to centralized middleware.
- Convert expected failures into explicit responses: validation `400`, auth `401` or `403`, not found `404`, conflicts `409`.
- Avoid swallowing database errors. Log enough context to diagnose the failure safely.

## Refactoring Guidance

- If a controller grows beyond request parsing and response shaping, extract the DB workflow into a dedicated module.
- If multiple endpoints reuse validation logic, consolidate it with `zod` schemas.
- If a new feature adds complex write flows, introduce transaction helpers early rather than after bugs appear.
