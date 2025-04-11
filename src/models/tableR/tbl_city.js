"use strict";

module.exports = function(sequelize, DataTypes) {
  var City = sequelize.define("tbl_city", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cityCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: 'city_unique_key',
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    cityName: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    areaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'tbl_city'
  }, {
    uniqueKeys: {
      city_unique_key: {
        fields: ['cityCode']
      }
    }
  })

  return City
}