// models/videoRating.js
const VideoRatingModel = (sequelize, DataTypes) => {
  const VideoRating = sequelize.define('VideoRating', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'videos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      },
      comment: 'Đánh giá từ 1-5 sao'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Nhận xét của người dùng'
    }
  }, {
    tableName: 'VideoRatings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'videoId'],
        name: 'unique_user_video_rating'
      }
    ]
  });

  // Define associations
  VideoRating.associate = (models) => {
    VideoRating.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    VideoRating.belongsTo(models.Video, {
      foreignKey: 'videoId',
      as: 'video'
    });
  };

  // Hooks để cập nhật averageScore của video
  VideoRating.afterCreate(async (rating, options) => {
    await updateVideoAverageRating(rating.videoId, options);
  });

  VideoRating.afterUpdate(async (rating, options) => {
    await updateVideoAverageRating(rating.videoId, options);
  });

  VideoRating.afterDestroy(async (rating, options) => {
    await updateVideoAverageRating(rating.videoId, options);
  });

  // Hàm helper để tính và cập nhật điểm trung bình
  const updateVideoAverageRating = async (videoId, options) => {
    const { Video } = sequelize.models;

    // Tính điểm trung bình mới
    const result = await VideoRating.findOne({
      where: { videoId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      raw: true
    });

    // Cập nhật averageScore của video
    await Video.update({
      averageScore: result.averageRating || 0
    }, {
      where: { id: videoId },
      transaction: options.transaction
    });
  };

  return VideoRating;
};

export default VideoRatingModel;