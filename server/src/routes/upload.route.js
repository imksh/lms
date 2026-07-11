import express from "express";
import { upload } from "../utils/cloudinary.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Single file upload — returns { url, public_id }
router.post(
  "/",
  protect,
  uploadLimiter,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res.status(200).json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  }
);

export default router;
