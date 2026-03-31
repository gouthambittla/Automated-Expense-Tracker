// src/modules/users/user.routes.js
import express from "express";
import verifyAuthToken from "../auth/auth.middleware.js";
import { getCurrentUser } from "./user.service.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";

const router = express.Router();

/**
 * Get current user profile
 * GET /api/users/me
 * Protected route - verifies Firebase token and returns user profile
 */
router.get("/me", verifyAuthToken, async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.firebaseUid, req.user.email);
    sendSuccess(res, 200, "User profile retrieved", user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    sendError(res, 500, "Failed to fetch user profile");
  }
});

export default router;
