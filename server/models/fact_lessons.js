// models/fact_lessons.js
const FactLessonsModel = (sequelize, DataTypes) => {
  const FactLessons = sequelize.define('FactLessons', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
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
    date: { 
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW 
    },
    totalUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Tổng số người dùng đã xem video'
    },
    completedUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Số người dùng đã hoàn thành video'
    },
    inProgressUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Số người dùng đang học video'
    },
    completionRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Tỷ lệ hoàn thành video (%)'
    },
    averageScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Điểm trung bình của người học (0-100)'
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Đánh giá trung bình của video (1-5)'
    }
  }, {
    tableName: 'fact_lessons',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['videoId', 'date'],
        name: 'unique_video_date'
      }
    ]
  });

  // Define associations
  FactLessons.associate = (models) => {
    FactLessons.belongsTo(models.Video, {
      foreignKey: 'videoId',
      as: 'video'
    });
  };

  return FactLessons;
};

export default FactLessonsModel;