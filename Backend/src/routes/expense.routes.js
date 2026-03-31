import express from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createExpense,
  getExpenses,
  getExpenseById,
} from "../controllers/expenseController.js";
const router = express.Router();

router.use(requireAuth);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/:id", getExpenseById);

export default router;
