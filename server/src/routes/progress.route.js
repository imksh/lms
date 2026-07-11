import express from "express";
import { getProgress, toggleProgress } from "../controllers/progress.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getProgress);

router.route("/toggle")
  .post(toggleProgress);

export default router;
