const FactUserModel = (sequelize, DataTypes) => {
  const FactUser = sequelize.define('FactUser', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    date: { 
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW 
    },
    total_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Tổng số người dùng'
    },
    user_growth: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Tỷ lệ tăng trưởng người dùng (%)'
    },
    total_lessons: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      defaultValue: 0,
      comment: 'Tổng số bài học'
    },
    lesson_growth: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Tỷ lệ tăng trưởng bài học (%)'
    },
    active_users_today: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Số người dùng hoạt động hôm nay'
    },
    active_users_growth: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Tỷ lệ tăng trưởng người dùng hoạt động (%)'
    },
    total_views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Tổng số lượt xem'
    },
    views_growth: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Tỷ lệ tăng trưởng lượt xem (%)'
    }
  }, {
    tableName: 'fact_users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['date']
      }
    ]
  });

  return FactUser;
};

export default FactUserModel;