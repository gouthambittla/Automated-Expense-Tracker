import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getUserInfo,
  updateUserBudget,
} from "../controllers/userInfo.controller.js";

const router = express.Router();

router.get("/", requireAuth, getUserInfo);
router.patch("/budget", requireAuth, updateUserBudget);

export default router;
