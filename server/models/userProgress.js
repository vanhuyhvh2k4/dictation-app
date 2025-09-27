// models/userProgress.js
const UserProgressModel = (sequelize, DataTypes) => {
  const UserProgress = sequelize.define('UserProgress', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    videoId: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.FLOAT, allowNull: true }
  });

  return UserProgress;
};

export default UserProgressModel;
