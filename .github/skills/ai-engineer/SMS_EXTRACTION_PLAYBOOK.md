# SMS Extraction Playbook

Use this playbook when building the message-to-expense pipeline.

## Objective

Convert raw phone messages into a normalized expense structure that can either be saved automatically when confidence is high or shown to the user for confirmation when confidence is low.

## Pipeline

1. Ingest the raw message and attach source metadata such as sender, timestamp, device source, or import batch ID.
2. Normalize text: trim whitespace, standardize currency symbols, expand common abbreviations when safe, and preserve the original text separately.
3. Run extraction using a structured prompt or model interface that targets the expense payload shape.
4. Validate the result with a strict schema.
5. Apply deterministic post-processing for dates, amounts, merchant names, payment methods, and category normalization.
6. Decide whether to auto-save or require review based on confidence and validation certainty.
7. Persist the normalized record together with the trace metadata.

## Extraction Heuristics

- Bank or wallet alerts often contain amount, merchant, timestamp, and payment instrument.
- Personal payment messages may mention a person name and purpose rather than a merchant category.
- Recharge, utility, EMI, and subscription messages need category normalization rules.
- If the message contains refunds or credits, do not force them into the same flow as expenses without an explicit product decision.

## Review Strategy

- Require review when amount is missing, merchant or person name is ambiguous, currency is unclear, or multiple transactions appear in one message.
- Surface both the raw text and the extracted fields in the review UI.
- Track approval edits so future prompts or rules can improve.
