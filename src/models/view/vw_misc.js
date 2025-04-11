"use strict";

module.exports = function(sequelize, DataTypes) {
  var Misc = sequelize.define("vw_misc", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    miscCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: 'misc_unique_key',
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    miscName: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: 'misc_unique_key',
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    miscDesc: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_]{3,50}$/i
      }
    },
    miscVariable: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_]{3,50}$/i
      }
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
    tableName: 'vw_misc'
  }, {
    uniqueKeys: {
      misc_unique_key: {
        fields: ['miscCode']
      }
    }
  })

  return Misc
}