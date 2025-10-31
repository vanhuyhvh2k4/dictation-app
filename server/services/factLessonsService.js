// services/factLessonsService.js
import models, { sequelize } from '../models/index.js';

const { FactLessons, Video, UserProgress, VideoRating } = models;

class FactLessonsService {
  static async updateFactLessons() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Lấy tất cả video
      const videos = await Video.findAll({
        where: {
          status: 'publish'
        }
      });

      // Cập nhật metrics cho từng video
      for (const video of videos) {
        const [factLesson] = await FactLessons.findOrCreate({
          where: {
            videoId: video.id,
            date: today
          },
          defaults: {
            totalUsers: 0,
            completedUsers: 0,
            inProgressUsers: 0,
            completionRate: 0,
            averageScore: 0,
            averageRating: 0
          }
        });

        // Tính toán các metrics
        const totalUsers = await UserProgress.count({
          where: { videoId: video.id }
        });

        const completedUsers = await UserProgress.count({
          where: { 
            videoId: video.id,
            completed: true
          }
        });

        const inProgressUsers = totalUsers - completedUsers;

        // Tính điểm trung bình
        const averageScoreResult = await UserProgress.findOne({
          where: { videoId: video.id },
          attributes: [
            [sequelize.fn('AVG', sequelize.col('totalScore')), 'avgScore']
          ],
          raw: true
        });

        // Tính rating trung bình
        const averageRatingResult = await VideoRating.findOne({
          where: { videoId: video.id },
          attributes: [
            [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
          ],
          raw: true
        });

        // Cập nhật fact_lessons
        await factLesson.update({
          totalUsers,
          completedUsers,
          inProgressUsers,
          completionRate: totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0,
          averageScore: averageScoreResult.avgScore || 0,
          averageRating: averageRatingResult.avgRating || 0
        });
      }

      console.log('FactLessons updated successfully:', new Date());
    } catch (error) {
      console.error('Error updating FactLessons:', error);
    }
  }

  static startPeriodicUpdate() {
    // Cập nhật ngay lập tức lần đầu
    this.updateFactLessons();
    
    // Sau đó cập nhật mỗi 1 phút
    setInterval(() => {
      this.updateFactLessons();
    }, 60000); // 60000 ms = 1 phút
  }
}

export default FactLessonsService;