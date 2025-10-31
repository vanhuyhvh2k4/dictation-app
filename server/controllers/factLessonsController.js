import models, { sequelize } from '../models/index.js';
import { Op } from 'sequelize';

const { FactLessons, Video } = models;

// Lấy thống kê mới nhất của một video
export const getVideoLessonStats = async (req, res) => {
  try {
    const { videoId } = req.params;

    const stats = await FactLessons.findOne({
      where: { videoId },
      order: [['date', 'DESC']], // Lấy bản ghi mới nhất
      include: [{
        model: Video,
        as: 'video',
        attributes: ['title', 'level']
      }]
    });

    if (!stats) {
      return res.status(404).json({
        message: 'No statistics found for this video'
      });
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching video lesson stats:', error);
    res.status(500).json({
      message: 'Error fetching video lesson statistics',
      error: error.message
    });
  }
};

// Lấy thống kê theo khoảng thời gian của một video
export const getVideoLessonTrends = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Both startDate and endDate are required'
      });
    }

    const stats = await FactLessons.findAll({
      where: {
        videoId,
        date: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      order: [['date', 'ASC']],
      include: [{
        model: Video,
        as: 'video',
        attributes: ['title', 'level']
      }]
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching video lesson trends:', error);
    res.status(500).json({
      message: 'Error fetching video lesson trends',
      error: error.message
    });
  }
};

// Lấy top N video theo một metric cụ thể
export const getTopVideos = async (req, res) => {
  try {
    const { metric = 'completionRate', limit = 10 } = req.query;
    
    // Validate metric
    const allowedMetrics = ['completionRate', 'averageScore', 'averageRating', 'totalUsers'];
    if (!allowedMetrics.includes(metric)) {
      return res.status(400).json({
        message: 'Invalid metric. Allowed values: ' + allowedMetrics.join(', ')
      });
    }

    // Lấy thống kê mới nhất của mỗi video
    const latestStats = await FactLessons.findAll({
      attributes: [
        'videoId',
        'totalUsers',
        'completedUsers',
        'inProgressUsers',
        'completionRate',
        'averageScore',
        'averageRating'
      ],
      where: {
        date: {
          [Op.eq]: models.sequelize.literal(
            '(SELECT MAX(date) FROM fact_lessons f2 WHERE f2.videoId = FactLessons.videoId)'
          )
        }
      },
      order: [[metric, 'DESC']],
      limit: parseInt(limit),
      include: [{
        model: Video,
        as: 'video',
        attributes: ['title', 'level', 'thumbnail']
      }]
    });

    res.status(200).json(latestStats);
  } catch (error) {
    console.error('Error fetching top videos:', error);
    res.status(500).json({
      message: 'Error fetching top videos',
      error: error.message
    });
  }
};

// Lấy tổng quan thống kê của tất cả video
export const getLessonOverview = async (req, res) => {
  try {
    // Lấy thống kê mới nhất của mỗi video
    const latestStats = await FactLessons.findAll({
      where: {
        date: {
          [Op.eq]: sequelize.literal(
            '(SELECT MAX(date) FROM fact_lessons f2 WHERE f2.videoId = FactLessons.videoId)'
          )
        }
      }
    });

    // Tính toán các metric tổng hợp
    const overview = {
      totalLessons: latestStats.length,
      totalUsers: latestStats.reduce((sum, stat) => sum + stat.totalUsers, 0),
      totalCompletions: latestStats.reduce((sum, stat) => sum + stat.completedUsers, 0),
      averageCompletionRate: latestStats.reduce((sum, stat) => sum + stat.completionRate, 0) / latestStats.length,
      averageScore: latestStats.reduce((sum, stat) => sum + stat.averageScore, 0) / latestStats.length,
      averageRating: latestStats.reduce((sum, stat) => sum + stat.averageRating, 0) / latestStats.length,
      lessonsByLevel: latestStats.reduce((acc, stat) => {
        if (stat.video) {
          acc[stat.video.level] = (acc[stat.video.level] || 0) + 1;
        }
        return acc;
      }, {})
    };

    res.status(200).json(overview);
  } catch (error) {
    console.error('Error fetching lesson overview:', error);
    res.status(500).json({
      message: 'Error fetching lesson overview',
      error: error.message
    });
  }
};