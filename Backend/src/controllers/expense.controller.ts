import { Request, Response } from "express";

export const getExpenses = (_req: Request, res: Response) => {
  res.status(200).json({ data: [], message: "Expenses endpoint placeholder" });
};

export const createExpense = (_req: Request, res: Response) => {
  res.status(201).json({ message: "Create expense endpoint placeholder" });
};
