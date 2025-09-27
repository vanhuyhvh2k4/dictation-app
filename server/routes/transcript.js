// routes/transcript.js
import express from "express";
import multer from "multer";
import * as transcriptController from "../controllers/transcriptController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /generate - upload video
router.post(
  "/generate",
  upload.single("video"), // field name = video
  transcriptController.generateTranscript
);

// POST /import - upload subtitle
router.post(
  "/import",
  upload.single("subtitle"),
  transcriptController.importSubtitle
);

export default router;
