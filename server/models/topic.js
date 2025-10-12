import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Video from './video.js';

const Topic = sequelize.define('Topic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  levels: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lessons: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  hasVideo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

export default Topic;