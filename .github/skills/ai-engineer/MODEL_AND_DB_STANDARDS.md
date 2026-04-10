# Model And DB Standards

## Model Integration Standards

1. Choose providers and SDKs that support structured or JSON output reliably.
2. Version prompts and extraction schemas.
3. Log request and response metadata without exposing secrets.
4. Make provider access replaceable behind a narrow adapter.
5. Add timeouts, retries, and fallback behavior for inference failures.

## Database Mapping Standards

- Persist original text in `source_text`.
- Persist confidence in `ai_confidence`.
- Persist raw structured model output in `ai_raw_json`.
- Persist pipeline metadata such as model name, provider, prompt version, parser version, sender type, and ingestion source in `metadata`.
- Set `source_type` to a clear AI-backed source value such as `sms_ai` or `message_ai`.
- Set `is_user_verified` to `false` by default unless a human confirms the record.

## Engineering Standards

- Do not couple prompt text directly to route handlers.
- Keep extraction schemas in code, reviewed like any other contract.
- Add fixture-based tests for representative SMS patterns before relying on the feature.
- Track false positives and false negatives as product metrics, not just engineering notes.
- Prefer conservative automation in finance flows. It is better to ask the user to confirm than to save an incorrect transaction silently.
