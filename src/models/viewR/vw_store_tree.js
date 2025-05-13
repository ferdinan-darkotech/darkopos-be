"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var StoreTree = sequelize.define("vw_lov_store_tree", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: { type: DataTypes.INTEGER },
    storeCode: { type: DataTypes.STRING },
    storeName: { type: DataTypes.STRING },
    paths: { type: DataTypes.STRING },
    level: { type: DataTypes.INTEGER },
    storeParentId: { type: DataTypes.INTEGER },
    storeParentCode: { type: DataTypes.STRING },
    storeParentName: { type: DataTypes.STRING }
  }, {
      tableName: 'vw_lov_store_tree',
      freezeTableName: true,
      timestamps: false
    })

  StoreTree.removeAttribute('id')
  return StoreTree
}