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

// Lấy thống kê của tất cả video hoặc top N video
export const getAllVideoStats = async (req, res) => {
  try {
    const { limit, sortBy = 'totalUsers', order = 'DESC' } = req.query;

    // Validate sortBy parameter
    const allowedSortFields = [
      'totalUsers', 
      'completedUsers', 
      'inProgressUsers',
      'completionRate',
      'averageScore',
      'averageRating'
    ];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: `Invalid sortBy parameter. Allowed values: ${allowedSortFields.join(', ')}`
      });
    }

    // Validate order parameter
    if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
      return res.status(400).json({
        message: 'Invalid order parameter. Allowed values: ASC, DESC'
      });
    }

    // Lấy ngày mới nhất cho mỗi video
    const latestDates = await FactLessons.findAll({
      attributes: [
        'videoId',
        [sequelize.fn('MAX', sequelize.col('date')), 'maxDate']
      ],
      group: ['videoId']
    });

    // Tạo điều kiện WHERE cho các ngày mới nhất
    const whereConditions = {
      [Op.or]: latestDates.map(item => ({
        videoId: item.videoId,
        date: item.get('maxDate')
      }))
    };

    // Query chính để lấy thống kê
    const stats = await FactLessons.findAll({
      where: whereConditions,
      order: [[sortBy, order.toUpperCase()]],
      ...(limit ? { limit: parseInt(limit) } : {}),
      include: [{
        model: Video,
        as: 'video',
        attributes: ['id', 'title', 'level', 'thumbnail', 'channel', 'view']
      }]
    });

    // Tính toán tổng quan nếu không có limit
    if (!limit) {
      const overview = {
        totalVideos: stats.length,
        averageCompletionRate: stats.reduce((acc, curr) => acc + curr.completionRate, 0) / stats.length,
        averageRating: stats.reduce((acc, curr) => acc + curr.averageRating, 0) / stats.length,
        totalActiveUsers: stats.reduce((acc, curr) => acc + curr.inProgressUsers, 0),
        totalCompletedUsers: stats.reduce((acc, curr) => acc + curr.completedUsers, 0),
        statsByLevel: stats.reduce((acc, curr) => {
          const level = curr.video.level;
          if (!acc[level]) {
            acc[level] = {
              count: 0,
              totalUsers: 0,
              completedUsers: 0
            };
          }
          acc[level].count++;
          acc[level].totalUsers += curr.totalUsers;
          acc[level].completedUsers += curr.completedUsers;
          return acc;
        }, {})
      };

      return res.status(200).json({
        overview,
        videos: stats
      });
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching all video statistics:', error);
    res.status(500).json({
      message: 'Error fetching video statistics',
      error: error.message
    });
  }
};