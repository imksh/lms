import express from "express";
import { getAnswers, saveAnswer } from "../controllers/answer.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAnswers)
  .post(saveAnswer);

export default router;
