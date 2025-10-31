import express from 'express';
import * as factLessonsCtrl from '../controllers/factLessonController.js';
import isAdminMiddleware from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

// Bảo vệ tất cả routes với middleware admin
router.use(isAdminMiddleware);

// Lấy thống kê mới nhất của một video
router.get('/lessons/videos/:videoId/stats', factLessonsCtrl.getVideoLessonStats);

// Lấy thống kê theo thời gian của một video
router.get('/lessons/videos/:videoId/trends', factLessonsCtrl.getVideoLessonTrends);

// Lấy thống kê của tất cả video hoặc top N video
router.get('/lessons/videos', factLessonsCtrl.getAllVideoStats);

export default router;