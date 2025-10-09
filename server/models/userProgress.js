// models/userProgress.js
const UserProgressModel = (sequelize, DataTypes) => {
  const UserProgress = sequelize.define('UserProgress', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    videoId: { type: DataTypes.INTEGER, allowNull: false },
    currentTranscriptIndex: { type: DataTypes.INTEGER, defaultValue: 0 }, // Index of current transcript
    completed: { type: DataTypes.BOOLEAN, defaultValue: false }, // Whether all transcripts are completed
    totalScore: { type: DataTypes.FLOAT, defaultValue: 0 }, // Average score of all completed transcripts
    transcriptsCompleted: { type: DataTypes.INTEGER, defaultValue: 0 }, // Number of completed transcripts
    lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW } // Last time progress was updated
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
