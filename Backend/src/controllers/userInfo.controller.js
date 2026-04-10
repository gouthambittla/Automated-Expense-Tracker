import { query } from "../config/db.js";

export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await query(
      "SELECT id, name, email, monthly_budget, daily_budget FROM users WHERE id = $1",
      [userId],
    );
    if (!result.rows[0])
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "User info fetched successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get user info error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserBudget = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { monthlyBudget, dailyBudget } = req.body;

    const current = await query(
      "SELECT monthly_budget, daily_budget FROM users WHERE id = $1",
      [userId],
    );

    if (!current.rows[0])
      return res.status(404).json({ message: "User not found" });

    const currentMonthly = current.rows[0].monthly_budget;
    const currentDaily = current.rows[0].daily_budget;

    const newMonthly =
      monthlyBudget === undefined || monthlyBudget === null
        ? currentMonthly
        : Number(monthlyBudget);
    const newDaily =
      dailyBudget === undefined || dailyBudget === null
        ? currentDaily
        : Number(dailyBudget);

    if (
      (newMonthly !== null && Number.isNaN(newMonthly)) ||
      (newDaily !== null && Number.isNaN(newDaily))
    ) {
      return res
        .status(400)
        .json({ message: "Budgets must be valid numbers or null" });
    }

    if (
      (newMonthly !== null && newMonthly < 0) ||
      (newDaily !== null && newDaily < 0)
    ) {
      return res
        .status(400)
        .json({ message: "Budgets must be greater than or equal to 0" });
    }

    const updateResult = await query(
      `UPDATE users SET monthly_budget = $1, daily_budget = $2 WHERE id = $3 RETURNING id, name, email, monthly_budget, daily_budget`,
      [newMonthly, newDaily, userId],
    );

    return res.status(200).json({
      message: "Budgets updated successfully",
      user: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Update user budget error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
