import express from "express";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  reorderSubjects,
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/cms.controller.js";
import { protect, optionalProtect } from "../middleware/auth.middleware.js";
import { adminOnly, teacherOrAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public GET routes (with optional auth for access filtering)
router.get("/subjects", optionalProtect, getSubjects);
router.get("/topics", optionalProtect, getTopics);

// Subject CRUD — teacher or admin can manage content
router.post("/subjects", protect, teacherOrAdmin, createSubject);
router.put("/subjects/reorder", protect, adminOnly, reorderSubjects);
router.put("/subjects/:key", protect, teacherOrAdmin, updateSubject);
// Delete subject cascades topics — admin only
router.delete("/subjects/:key", protect, adminOnly, deleteSubject);

// Topic CRUD — teacher or admin
router.post("/topics", protect, teacherOrAdmin, createTopic);
router.put("/topics/:topicId", protect, teacherOrAdmin, updateTopic);
router.delete("/topics/:topicId", protect, teacherOrAdmin, deleteTopic);

export default router;
