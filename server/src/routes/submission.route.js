import express from "express";
import {
  submitTask,
  getMySubmissions,
  getAllSubmissions,
  evaluateSubmission,
} from "../controllers/submission.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly, teacherOrAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(protect);

// Student submit routes
router.post("/", submitTask);
router.get("/my", getMySubmissions);

// Protected Admin/Teacher evaluation routes
router.get("/", teacherOrAdmin, getAllSubmissions);
router.put("/:id/evaluate", teacherOrAdmin, evaluateSubmission);

export default router;
