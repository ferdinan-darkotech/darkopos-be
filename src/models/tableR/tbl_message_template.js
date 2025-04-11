module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbl_message_template", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content_body: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: '{}'
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    create_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    update_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, { tableName: 'tbl_message_template', freezeTableName: true, timestamps: false })
}
