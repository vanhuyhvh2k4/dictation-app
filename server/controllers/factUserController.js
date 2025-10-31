import models from '../models/index.js';
const { FactUser } = models;
import { Op } from 'sequelize';

// Get analytics data for today
export const getTodayAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = await FactUser.findOne({
      where: {
        date: today
      }
    });

    if (!analytics) {
      return res.status(404).json({
        message: "No analytics data found for today"
      });
    }

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching today's analytics:", error);
    res.status(500).json({
      message: "Error fetching analytics data",
      error: error.message
    });
  }
};

// Get analytics data for a specific date range
export const getAnalyticsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Both startDate and endDate are required"
      });
    }

    const analytics = await FactUser.findAll({
      where: {
        date: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      order: [['date', 'ASC']]
    });

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching analytics by date range:", error);
    res.status(500).json({
      message: "Error fetching analytics data",
      error: error.message
    });
  }
};

// Get analytics data for last n days
export const getLastNDaysAnalytics = async (req, res) => {
  try {
    const { days = 7 } = req.query; // Mặc định 7 ngày
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - parseInt(days));

    const analytics = await FactUser.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });

    // Tính toán tổng quan cho khoảng thời gian
    const summary = {
      periodStart: startDate,
      periodEnd: endDate,
      averageActiveUsers: Math.round(analytics.reduce((sum, day) => sum + day.active_users_today, 0) / analytics.length),
      totalViews: analytics.reduce((sum, day) => sum + day.total_views, 0),
      userGrowthRate: analytics.length > 0 ? analytics[analytics.length - 1].user_growth : 0,
      data: analytics
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching last N days analytics:", error);
    res.status(500).json({
      message: "Error fetching analytics data",
      error: error.message
    });
  }
};