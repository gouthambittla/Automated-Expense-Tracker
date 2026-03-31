import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getUserInfo } from "../controllers/userInfo.controller.js";

const router = express.Router();

router.get("/", requireAuth, getUserInfo);

export default router;
