module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbl_setting_approval", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    appv_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appv_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appv_desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appv_users: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    appv_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    pass_code: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, { tableName: 'tbl_setting_approval', timestamps: false })
}
