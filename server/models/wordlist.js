// models/wordlist.js
const WordlistModel = (sequelize, DataTypes) => {
  const Wordlist = sequelize.define('Wordlist', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    word: { type: DataTypes.STRING, allowNull: false },
    meaning: { type: DataTypes.STRING }
  });

  return Wordlist;
};

export default WordlistModel;
