import express from "express";
import { getMeta, updateMeta } from "../controllers/meta.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", getMeta);
router.put("/", protect, adminOnly, updateMeta);

export default router;
