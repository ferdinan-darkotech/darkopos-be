module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbl_log_feedback_sales", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    apps_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_account: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    store_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trans_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feedback_point: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, { tableName: 'tbl_log_feedback_sales', freezeTableName: true, timestamps: false })
}
