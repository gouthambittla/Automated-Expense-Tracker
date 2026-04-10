# Backend Repo Context

Use this file as the repo-specific grounding for backend work.

Current stack detected from `Backend/package.json`:

- Express `^5.2.1`
- PostgreSQL client `pg` `^8.20.0`
- `zod` `^4.3.6`
- `jsonwebtoken`, `bcrypt`, `helmet`, `cors`, `morgan`
- `nodemon` for local development

Observed repo patterns:

- App bootstrapping lives in `src/app.js` and `src/server.js`.
- Database pool is created in `src/config/db.js` using `connectionString` from env.
- Controllers currently contain validation and SQL calls directly.
- `src/db/schema.sql` defines `users` and `expenses` with AI-related fields already present.
- Error handling is centralized in `src/middleware/error.middleware.js`, but it is still minimal.

Practical implications:

- The repo is already prepared for richer AI-backed ingestion because `expenses` includes `source_text`, `ai_confidence`, `ai_raw_json`, `metadata`, and `is_user_verified`.
- The next backend improvements should prioritize validation consistency, safer error mapping, and reusable SQL patterns.
- Stay aligned with ESM imports and the current route/controller structure.
