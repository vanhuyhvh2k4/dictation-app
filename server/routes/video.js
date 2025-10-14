// routes/videoRoutes.js
import express from "express";
import multer from "multer";
import * as videoCtrl from "../controllers/videoController.js";
import * as transcriptCtrl from "../controllers/transcriptController.js";
import { videoSchema } from "../validators/videoSchema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // giữ file trong memory

import optionalAuth from '../middlewares/optionalAuth.js';

router.get("/", optionalAuth, videoCtrl.getListVideos);

// Get video by ID
router.get("/:id", videoCtrl.getVideoById);

// POST /api/video/upload
router.post(
  "/upload",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
  ]),
  (req, res, next) => {

    const { error, value } = videoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // 2. Validate file tồn tại
    if (!req.files || !req.files.video || !req.files.thumbnail || !req.files.transcript) {
      return res.status(400).json({ error: "Video file and thumbnail are required" });
    }

      // 3. Validate loại file (ví dụ: chỉ chấp nhận mp4, jpg, png)
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];
    const transcriptFile = req.files.transcript[0];

    const allowedVideoTypes = ["video/mp4", "video/mkv"];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/avif"];
    const allowedSubtitleTypes = ["text/plain", "application/octet-stream", "text/vtt", "text/srt"];

    if (!allowedVideoTypes.includes(videoFile.mimetype)) {
      return res.status(400).json({ error: "Unsupported video format (mp4, mkv allowed)" });
    }

    if (!allowedImageTypes.includes(thumbnailFile.mimetype)) {
      return res.status(400).json({ error: "Unsupported thumbnail format (jpg, png allowed)" });
    }

    if (!allowedSubtitleTypes.includes(transcriptFile.mimetype)) {
      return res.status(400).json({ error: "Unsupported transcript format (txt, srt, vtt allowed)" });
    }

    req.validatedBody = value;
    next();
  },
  videoCtrl.uploadVideo,
  videoCtrl.uploadThumbnail,
  videoCtrl.finalizeUpload,
  transcriptCtrl.importSubtitle
);

export default router;
