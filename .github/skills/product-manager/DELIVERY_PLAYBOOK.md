# Delivery Playbook

## How To Run A Feature

1. Define the user problem and business value in one paragraph.
2. State in-scope and out-of-scope behavior.
3. Identify which layers change: mobile UI, backend API, SQL schema, AI pipeline, analytics, or operations.
4. Write acceptance criteria in user-visible language.
5. Break the work into a sequence that reduces integration risk.
6. Identify what must be tested manually and what should be automated.
7. Define post-launch signals such as adoption, success rate, error rate, or review completion rate.

## Recommended Breakdown For This Repo

- Frontend: screen changes, review flows, analytics views, validation messages, loading and empty states.
- Backend: route contracts, auth behavior, validation, SQL writes, audit metadata.
- AI: extraction contract, model provider, confidence handling, review thresholds.
- Data: schema changes, indexes, migration notes, reporting implications.
- QA: happy path, ambiguous messages, bad inputs, latency, offline or retry behavior.

## Release Standards

- No feature is complete without a rollback path or safe failure mode.
- AI-assisted finance behavior should default to review when uncertain.
- Avoid shipping product language that promises accuracy beyond what has been measured.
