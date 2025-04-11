module.exports = function (sequelize, DataTypes) {
  return sequelize.define("tbd_target", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    targetSalesQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    targetSalesValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  }, { tableName: 'tbd_target' })
}
