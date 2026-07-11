import express from "express";
import {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  assignTeacher,
  reorderModules,
} from "../controllers/module.controller.js";
import { protect, optionalProtect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public (with optional auth for access filtering)
router.get("/", optionalProtect, getModules);
router.get("/:id", optionalProtect, getModuleById);

// Admin only
router.post("/", protect, adminOnly, createModule);
router.put("/reorder", protect, adminOnly, reorderModules);
router.put("/:id", protect, adminOnly, updateModule);
router.delete("/:id", protect, adminOnly, deleteModule);
router.put("/:id/assign-teacher", protect, adminOnly, assignTeacher);

export default router;
