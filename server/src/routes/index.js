import express from "express";
import authRoutes from "./auth.route.js";
import noteRoutes from "./note.route.js";
import progressRoutes from "./progress.route.js";
import answerRoutes from "./answer.route.js";
import cmsRoutes from "./cms.route.js";
import submissionRoutes from "./submission.route.js";
import uploadRoutes from "./upload.route.js";
import moduleRoutes from "./module.route.js";
import metaRoutes from "./meta.route.js";
import userRoutes from "./user.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/progress", progressRoutes);
router.use("/answers", answerRoutes);
router.use("/cms", cmsRoutes);
router.use("/submissions", submissionRoutes);
router.use("/upload", uploadRoutes);
router.use("/modules", moduleRoutes);
router.use("/meta", metaRoutes);
router.use("/users", userRoutes);

export default router;
