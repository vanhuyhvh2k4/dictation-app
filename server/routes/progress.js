import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { 
    updateVideoProgress, 
    getVideoProgress,
    getAllUserProgress 
} from '../controllers/progressController.js';

const router = express.Router();

// Lấy tiến độ của 1 video cụ thể
router.get('/:videoId', authMiddleware, getVideoProgress);

// Lấy tiến độ của tất cả video của user
router.get('/', authMiddleware, getAllUserProgress);

// Cập nhật tiến độ xem video
router.post('/:videoId', authMiddleware, updateVideoProgress);

export default router;