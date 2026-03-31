import { query } from "../config/db.js";

const validateCreateExpense = (body) => {
  const { entryType, amount, paymentDate, category, paidTo } = body;

  if (!entryType || typeof entryType !== "string") {
    return "entryType is required";
  }

  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return "amount is required and must be a valid number";
  }

  if (Number(amount) < 0) {
    return "amount must be greater than or equal to 0";
  }

  if (!paymentDate) {
    return "paymentDate is required";
  }

  const normalizedEntryType = entryType.trim().toLowerCase();

  if (normalizedEntryType === "expense" && !category) {
    return "category is required for expense entry type";
  }

  if (normalizedEntryType === "paid_to_person" && !paidTo) {
    return "paidTo is required for paid_to_person entry type";
  }

  return null;
};

export const createExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      entryType,
      sourceType = "manual",
      amount,
      currency = "INR",
      title = null,
      category = null,
      paidTo = null,
      paymentFor = null,
      paymentMethod = null,
      paymentDate,
      notes = null,
      paymentProofUrl = null,
      sourceText = null,
      aiConfidence = null,
      aiRawJson = null,
      metadata = null,
      isUserVerified = false,
    } = req.body;

    const validationError = validateCreateExpense(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const insertQuery = `
      INSERT INTO expenses (
        user_id,
        entry_type,
        source_type,
        amount,
        currency,
        title,
        category,
        paid_to,
        payment_for,
        payment_method,
        payment_date,
        notes,
        payment_proof_url,
        source_text,
        ai_confidence,
        ai_raw_json,
        metadata,
        is_user_verified
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18
      )
      RETURNING *;
    `;

    const values = [
      userId,
      entryType,
      sourceType,
      Number(amount),
      currency,
      title,
      category,
      paidTo,
      paymentFor,
      paymentMethod,
      paymentDate,
      notes,
      paymentProofUrl,
      sourceText,
      aiConfidence,
      aiRawJson ? JSON.stringify(aiRawJson) : null,
      metadata ? JSON.stringify(metadata) : null,
      isUserVerified,
    ];

    const result = await query(insertQuery, values);

    return res.status(201).json({
      message: "Expense created successfully",
      expense: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `
      SELECT *
      FROM expenses
      WHERE user_id = $1
      ORDER BY payment_date DESC, created_at DESC
      `,
      [userId],
    );

    return res.status(200).json({
      message: "Expenses fetched successfully",
      expenses: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await query(
      `
      SELECT *
      FROM expenses
      WHERE id = $1 AND user_id = $2
      LIMIT 1
      `,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({
      message: "Expense fetched successfully",
      expense: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
