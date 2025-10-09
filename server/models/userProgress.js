// models/userProgress.js
const UserProgressModel = (sequelize, DataTypes) => {
  const UserProgress = sequelize.define('UserProgress', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    videoId: { type: DataTypes.INTEGER, allowNull: false },
    currentTime: { type: DataTypes.FLOAT, defaultValue: 0 }, // Current video time in seconds
    completed: { type: DataTypes.BOOLEAN, defaultValue: false }, // Whether video is completed
    score: { type: DataTypes.FLOAT, allowNull: true },
    lastWatched: { type: DataTypes.DATE, defaultValue: DataTypes.NOW } // Last time user watched this video
  });

  // Define associations
  UserProgress.associate = (models) => {
    UserProgress.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    UserProgress.belongsTo(models.Video, {
      foreignKey: 'videoId',
      as: 'video'
    });
  };

  return UserProgress;
};

export default UserProgressModel;
