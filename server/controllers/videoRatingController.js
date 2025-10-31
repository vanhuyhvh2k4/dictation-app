import models, { sequelize } from '../models/index.js';
const { VideoRating, User, Video } = models;

// Lấy tất cả đánh giá của một video
export const getVideoRatings = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const ratings = await VideoRating.findAll({
      where: { videoId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name'] // Chỉ lấy thông tin cần thiết
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching video ratings:', error);
    res.status(500).json({ 
      message: 'Error fetching video ratings',
      error: error.message 
    });
  }
};

// Lấy đánh giá của user hiện tại cho video
export const getUserVideoRating = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;

    const rating = await VideoRating.findOne({
      where: { 
        videoId,
        userId 
      }
    });

    if (!rating) {
      return res.status(404).json({ 
        message: 'Rating not found' 
      });
    }

    res.status(200).json(rating);
  } catch (error) {
    console.error('Error fetching user video rating:', error);
    res.status(500).json({ 
      message: 'Error fetching user video rating',
      error: error.message 
    });
  }
};

// Tạo hoặc cập nhật đánh giá
export const createOrUpdateRating = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5'
      });
    }

    // Kiểm tra video tồn tại
    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({
        message: 'Video not found'
      });
    }

    // Tìm đánh giá hiện tại của user
    const [videoRating, created] = await VideoRating.findOrCreate({
      where: { 
        userId,
        videoId 
      },
      defaults: {
        rating,
        comment
      }
    });

    // Nếu đã tồn tại → cập nhật
    if (!created) {
      await videoRating.update({
        rating,
        comment
      });
    }

    res.status(created ? 201 : 200).json({
      message: created ? 'Rating created successfully' : 'Rating updated successfully',
      rating: videoRating
    });
  } catch (error) {
    console.error('Error creating/updating rating:', error);
    res.status(500).json({ 
      message: 'Error creating/updating rating',
      error: error.message 
    });
  }
};

// Xóa đánh giá
export const deleteRating = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;

    const deleted = await VideoRating.destroy({
      where: { 
        videoId,
        userId 
      }
    });

    if (!deleted) {
      return res.status(404).json({
        message: 'Rating not found'
      });
    }

    res.status(200).json({
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ 
      message: 'Error deleting rating',
      error: error.message 
    });
  }
};

// Lấy thống kê đánh giá của video
export const getVideoRatingStats = async (req, res) => {
  try {
    const { videoId } = req.params;

    const stats = await VideoRating.findAll({
      where: { videoId },
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    // Tính tổng số đánh giá và điểm trung bình
    const totalRatings = stats.reduce((sum, stat) => sum + parseInt(stat.count), 0);
    const averageRating = stats.reduce((sum, stat) => 
      sum + (stat.rating * stat.count), 0) / totalRatings;

    res.status(200).json({
      totalRatings,
      averageRating,
      distributionByRating: stats
    });
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    res.status(500).json({ 
      message: 'Error fetching rating stats',
      error: error.message 
    });
  }
};