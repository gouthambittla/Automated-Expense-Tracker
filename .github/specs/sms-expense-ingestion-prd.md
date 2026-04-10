# SMS Expense Ingestion PRD

## Feature Name

SMS To Expense Extraction

## Problem

Users already receive transaction information in bank, wallet, UPI, card, recharge, and personal payment messages, but the app currently requires manual data entry. That creates friction, lowers capture consistency, and makes analytics incomplete because many transactions never get recorded.

## Goal

Allow the product to convert supported phone messages into structured expense records with clear confidence handling, user review, and traceability back to the original message.

## Non-Goals

- Full native SMS ingestion implementation in this iteration.
- Automatic handling of every financial message category from day one.
- Silent background creation of expenses without confidence thresholds or user review.
- Support for income, refunds, or complex split transactions unless explicitly defined.

## Users And Scenarios

- Primary user: a mobile user who wants expense tracking to happen with less manual work.
- Scenario 1: user imports or grants access to recent bank or wallet messages and sees suggested expenses ready for review.
- Scenario 2: a high-confidence merchant payment alert is converted into a prefilled expense entry.
- Scenario 3: an ambiguous message is flagged for manual confirmation instead of being auto-saved.
- Scenario 4: the user edits extracted fields before confirming the record.

## Scope

### Frontend changes

- Add a review surface for AI-suggested expenses.
- Show raw message text, extracted fields, confidence, and editable values.
- Support confirm, edit, reject, and retry flows.

### Backend changes

- Add endpoints for message ingestion, extraction preview, confirmation, and rejection.
- Validate normalized payloads before saving to `expenses`.
- Persist extraction trace data and review status.

### AI or extraction changes

- Define a structured extraction contract for supported message types.
- Add normalization, confidence scoring, and fallback rules.
- Version prompts or extraction logic.

### Data model changes

- Reuse current `expenses` AI fields where possible.
- Consider a separate staging table for imported messages and review state if direct expense creation becomes too limiting.

## Acceptance Criteria

- The system can take a supported SMS message and produce a structured extraction preview containing amount, date, party or merchant, category when available, and source metadata.
- Invalid or ambiguous extraction results are not auto-saved as verified expenses.
- Every AI-assisted record stores original message text, raw structured output, confidence, and metadata for auditing.
- The user can review, edit, confirm, or reject extracted records from the mobile app.
- Confirmed records appear in the existing expense list and analytics flow.
- The system supports a measurable definition of high-confidence auto-save versus review-required behavior.

## Risks And Open Questions

- Android and iOS access patterns for phone messages differ substantially.
- Message formats vary widely across banks, wallets, and countries.
- Category inference quality may lag behind amount and merchant extraction quality.
- Open question: should imported messages be stored in a separate ingestion table before they become expenses?
- Open question: what confidence threshold qualifies for auto-save in the first production release?

## Metrics

- Adoption metric: percentage of active users who enable or use message-based import.
- Quality metric: confirmed extraction accuracy rate by field and by message type.
- Operational metric: extraction latency and review completion rate.

## Release Recommendation

Ship in phases:

1. Manual paste or import of message text into an extraction preview flow.
2. User-confirmed save into expenses with audit metadata.
3. Native message ingestion and batched review.
4. High-confidence automation only after evaluation data supports it.