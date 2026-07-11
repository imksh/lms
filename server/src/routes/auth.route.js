import express from "express";
import {
  signup,
  login,
  getMe,
  logout,
  updateMe,
  getMyStats,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/me/stats", protect, getMyStats);

export default router;
