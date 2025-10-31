import models from '../models/index.js';
const { User, Video, UserProgress, FactUser } = models;
import { Op } from 'sequelize';

class FactUserService {
  static async updateFactUser() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Lấy dữ liệu của ngày hôm nay
      const [factUser, created] = await FactUser.findOrCreate({
        where: {
          date: today
        },
        defaults: {
          total_users: 0,
          user_growth: 0,
          total_lessons: 0,
          lesson_growth: 0,
          active_users_today: 0,
          active_users_growth: 0,
          total_views: 0,
          views_growth: 0
        }
      });

      // Lấy dữ liệu của ngày hôm trước
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFact = await FactUser.findOne({
        where: {
          date: yesterday
        }
      });

      // Tính toán các metrics mới
      const totalUsers = await User.count();
      const totalVideos = await Video.count(); // Sử dụng videos làm lessons

      // Tính người dùng hoạt động hôm nay (đã tương tác với video)
      const activeUsers = await UserProgress.count({
        distinct: true,
        col: 'userId',
        where: {
          updatedAt: {
            [Op.gte]: today
          }
        }
      });

      // Tính tổng lượt xem
      const totalViews = await Video.sum('view');

      // Tính tỷ lệ tăng trưởng
      const userGrowth = yesterdayFact ? ((totalUsers - yesterdayFact.total_users) / yesterdayFact.total_users) * 100 : 0;
      const lessonGrowth = yesterdayFact ? ((totalVideos - yesterdayFact.total_lessons) / yesterdayFact.total_lessons) * 100 : 0;
      const activeGrowth = yesterdayFact ? ((activeUsers - yesterdayFact.active_users_today) / yesterdayFact.active_users_today) * 100 : 0;
      const viewsGrowth = yesterdayFact ? ((totalViews - yesterdayFact.total_views) / yesterdayFact.total_views) * 100 : 0;

      // Cập nhật hoặc tạo bản ghi mới
      await factUser.update({
        total_users: totalUsers,
        user_growth: parseFloat(userGrowth.toFixed(2)),
        total_lessons: totalVideos,
        lesson_growth: parseFloat(lessonGrowth.toFixed(2)),
        active_users_today: activeUsers,
        active_users_growth: parseFloat(activeGrowth.toFixed(2)),
        total_views: totalViews,
        views_growth: parseFloat(viewsGrowth.toFixed(2))
      });

      console.log('FactUser updated successfully:', new Date());
    } catch (error) {
      console.error('Error updating FactUser:', error);
    }
  }

  static startPeriodicUpdate() {
    // Cập nhật ngay lập tức lần đầu
    this.updateFactUser();
    
    // Sau đó cập nhật mỗi 1 phút
    setInterval(() => {
      this.updateFactUser();
    }, 60000); // 60000 ms = 1 phút
  }
}

export default FactUserService;