// models/index.js
import Sequelize from 'sequelize';
import sequelize from '../config/database.js';

import User from './user.js';
import Video from './video.js';
import Transcript from './transcript.js';
import UserProgress from './userProgress.js';
import Wordlist from './wordlist.js';
import Topic from './topic.js';
import FactUser from './fact_user.js';
import VideoRating from './videoRating.js';

// Khởi tạo models
const models = {
  User: User(sequelize, Sequelize.DataTypes),
  Video: Video(sequelize, Sequelize.DataTypes),
  Transcript: Transcript(sequelize, Sequelize.DataTypes),
  UserProgress: UserProgress(sequelize, Sequelize.DataTypes),
  Wordlist: Wordlist(sequelize, Sequelize.DataTypes),
  Topic: Topic,
  FactUser: FactUser(sequelize, Sequelize.DataTypes),
  VideoRating: VideoRating(sequelize, Sequelize.DataTypes)
};

// Quan hệ
// Video - Transcript
models.Video.hasMany(models.Transcript, { foreignKey: 'videoId', onDelete: 'CASCADE' });
models.Transcript.belongsTo(models.Video, { foreignKey: 'videoId' });

// Video - UserProgress
models.Video.hasMany(models.UserProgress, { foreignKey: 'videoId', onDelete: 'CASCADE' });
models.UserProgress.belongsTo(models.Video, { foreignKey: 'videoId' });

// User - UserProgress
models.User.hasMany(models.UserProgress, { foreignKey: 'userId' });
models.UserProgress.belongsTo(models.User, { foreignKey: 'userId' });

models.User.hasMany(models.Wordlist, { foreignKey: 'userId' });
models.Wordlist.belongsTo(models.User, { foreignKey: 'userId' });

// Topic - Video
models.Topic.hasMany(models.Video, { 
  foreignKey: 'topicId',
  as: 'videos',
  onDelete: 'SET NULL'
});
models.Video.belongsTo(models.Topic, { 
  foreignKey: 'topicId',
  as: 'topic'
});

// Video - VideoRating
models.Video.hasMany(models.VideoRating, {
  foreignKey: 'videoId',
  as: 'ratings'
});
models.VideoRating.belongsTo(models.Video, {
  foreignKey: 'videoId',
  as: 'video'
});

// User - VideoRating
models.User.hasMany(models.VideoRating, {
  foreignKey: 'userId',
  as: 'ratings'
});
models.VideoRating.belongsTo(models.User, {
  foreignKey: 'userId',
  as: 'user'
});

// Export
export { sequelize };
export default models;
