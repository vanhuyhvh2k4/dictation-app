// models/index.js
import Sequelize from 'sequelize';
import sequelize from '../config/database.js';

import User from './user.js';
import Video from './video.js';
import Transcript from './transcript.js';
import UserProgress from './userProgress.js';
import Wordlist from './wordlist.js';

// Khởi tạo models
const models = {
  User: User(sequelize, Sequelize.DataTypes),
  Video: Video(sequelize, Sequelize.DataTypes),
  Transcript: Transcript(sequelize, Sequelize.DataTypes),
  UserProgress: UserProgress(sequelize, Sequelize.DataTypes),
  Wordlist: Wordlist(sequelize, Sequelize.DataTypes)
};

// Quan hệ
models.Video.hasMany(models.Transcript, { foreignKey: 'videoId', onDelete: 'CASCADE' });
models.Transcript.belongsTo(models.Video, { foreignKey: 'videoId' });

models.User.hasMany(models.UserProgress, { foreignKey: 'userId' });
models.UserProgress.belongsTo(models.User, { foreignKey: 'userId' });
models.UserProgress.belongsTo(models.Video, { foreignKey: 'videoId' });

models.User.hasMany(models.Wordlist, { foreignKey: 'userId' });
models.Wordlist.belongsTo(models.User, { foreignKey: 'userId' });

// Export
export { sequelize };
export default models;
