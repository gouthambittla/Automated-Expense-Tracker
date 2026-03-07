import { Router } from "express";

import { createExpense, getExpenses } from "../controllers/expense.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const expenseRouter = Router();

expenseRouter.get("/", requireAuth, getExpenses);
expenseRouter.post("/", requireAuth, createExpense);
