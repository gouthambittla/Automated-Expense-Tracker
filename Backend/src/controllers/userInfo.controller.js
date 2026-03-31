import { query } from "../config/db.js";

export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await query(
      "SELECT id, name, email FROM users WHERE id = $1",
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
