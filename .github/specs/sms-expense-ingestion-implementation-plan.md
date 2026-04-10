# SMS Expense Ingestion Implementation Plan

## Objective

Implement the first vertical slice of AI-assisted message-to-expense extraction without breaking the current manual entry flow.

## Recommended First Slice

Build a review-first workflow:

1. User provides message text.
2. Backend runs normalization and structured extraction.
3. Backend returns a preview payload with confidence and trace metadata.
4. User reviews and confirms the payload.
5. Backend persists the confirmed record into `expenses`.

This keeps the first version safe, measurable, and compatible with the existing schema.

## Workstreams

### Product

- Finalize supported message types for v1.
- Define confidence thresholds and review rules.
- Approve the staging versus direct-write data model choice.

### AI

- Define the extraction schema for the existing expense payload.
- Build prompt or model adapter contracts with versioning.
- Create a representative fixture set of real-world message samples.
- Implement post-processing for amount, currency, date, merchant, person name, and category normalization.

### Backend

- Add an extraction-preview endpoint.
- Add a confirm-and-save endpoint.
- Add validation schemas for AI output and user-confirmed payloads.
- Persist `source_text`, `ai_confidence`, `ai_raw_json`, `metadata`, and `is_user_verified` consistently.
- Introduce a staging table if review-state management requires it.

### Frontend

- Add a message input or import entry point.
- Build an extraction preview screen with editable fields.
- Show confidence, suggested category, raw message, and validation errors.
- Support confirm, reject, and retry actions.

### QA

- Test supported bank alerts, wallet alerts, UPI messages, and person-to-person payment messages.
- Test malformed, partial, duplicate, and multi-transaction messages.
- Verify low-confidence cases require review and do not silently save.

## Suggested Data Contract

Use the existing normalized payload shape:

```json
{
  "entryType": "expense",
  "sourceType": "sms_ai",
  "amount": 245.00,
  "currency": "INR",
  "title": "Swiggy",
  "category": "Food",
  "paidTo": null,
  "paymentFor": null,
  "paymentMethod": "upi",
  "paymentDate": "2026-04-10T10:45:00.000Z",
  "notes": null,
  "sourceText": "INR 245.00 spent on UPI at SWIGGY...",
  "aiConfidence": 0.91,
  "aiRawJson": {},
  "metadata": {
    "provider": "tbd",
    "model": "tbd",
    "promptVersion": "v1",
    "messageType": "bank_alert"
  },
  "isUserVerified": false
}
```

## Engineering Sequence

1. Add schema-level validation for the normalized AI payload.
2. Implement backend extraction preview using fixtures or a provider adapter.
3. Build frontend review UI using the current add-expense flow as the editing baseline.
4. Add confirm-and-save backend flow.
5. Measure extraction quality on a fixture dataset before considering automation.

## Risks

- If extraction output is persisted too early, the dataset becomes noisy and user trust drops.
- If native SMS access is tackled first, platform complexity may slow delivery without validating product value.
- If provider-specific output is stored without normalization, future model changes become painful.

## Immediate Next Build Step

Implement a backend-only extraction preview contract plus a fixture-based test set. That gives the project a stable integration point before native message access and UI review screens are added.