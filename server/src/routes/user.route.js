import express from "express";
import {
  getUsers,
  getUserById,
  approveUser,
  updateUserRole,
  assignUserModule,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// Admin only routes for managing users
router.use(protect, adminOnly);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id/approve", approveUser);
router.put("/:id/role", updateUserRole);
router.put("/:id/module", assignUserModule);
router.delete("/:id", deleteUser);

export default router;
