// models/transcript.js
const TranscriptModel = (sequelize, DataTypes) => {
  const Transcript = sequelize.define('Transcript', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    videoId: { type: DataTypes.INTEGER, allowNull: false },
    sentenceIndex: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    start: { type: DataTypes.FLOAT, allowNull: false },
    end: { type: DataTypes.FLOAT, allowNull: false }
  });

  return Transcript;
};

export default TranscriptModel;
