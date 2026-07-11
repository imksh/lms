import express from "express";
import { getNotes, saveNote } from "../controllers/note.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getNotes)
  .post(saveNote);

export default router;
