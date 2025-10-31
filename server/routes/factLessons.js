import express from 'express';
import * as factLessonsCtrl from '../controllers/factLessonsController.js';
import isAdminMiddleware from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

// Bảo vệ tất cả routes với middleware admin
router.use(isAdminMiddleware);

// Lấy thống kê mới nhất của một video
router.get('/lessons/videos/:videoId/stats', factLessonsCtrl.getVideoLessonStats);

// Lấy thống kê theo thời gian của một video
router.get('/lessons/videos/:videoId/trends', factLessonsCtrl.getVideoLessonTrends);

// Lấy top videos theo metric
router.get('/lessons/top-videos', factLessonsCtrl.getTopVideos);

// Lấy tổng quan thống kê của tất cả video
router.get('/lessons/overview', factLessonsCtrl.getLessonOverview);

export default router;