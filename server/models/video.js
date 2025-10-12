// models/video.js
const VideoModel = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    channel: { type: DataTypes.STRING, allowNull: false },
    view: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    topicId: { 
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'topics',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    thumbnail: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: true },
    level: { type: DataTypes.STRING, allowNull: true }
  });

  // Define associations
  Video.associate = (models) => {
    Video.hasMany(models.UserProgress, {
      foreignKey: 'videoId'
    });
    
    Video.hasMany(models.Transcript, {
      foreignKey: 'videoId'
    });

    Video.belongsTo(models.Topic, {
      foreignKey: 'topicId',
      as: 'topic'
    });
  };

  return Video;
};

export default VideoModel;
