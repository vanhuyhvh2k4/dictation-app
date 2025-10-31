import express from 'express';
import * as videoRatingCtrl from '../controllers/videoRatingController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Lấy tất cả đánh giá của một video (không cần đăng nhập)
router.get('/videos/:videoId/ratings', videoRatingCtrl.getVideoRatings);

// Lấy thống kê đánh giá của video (không cần đăng nhập)
router.get('/videos/:videoId/ratings/stats', videoRatingCtrl.getVideoRatingStats);

// Các routes yêu cầu đăng nhập
router.use(authMiddleware);

// Lấy đánh giá của user hiện tại
router.get('/videos/:videoId/ratings/me', videoRatingCtrl.getUserVideoRating);

// Tạo hoặc cập nhật đánh giá
router.post('/videos/:videoId/ratings', videoRatingCtrl.createOrUpdateRating);

// Xóa đánh giá
router.delete('/videos/:videoId/ratings', videoRatingCtrl.deleteRating);

export default router;