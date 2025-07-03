"use strict";

module.exports = function(sequelize, DataTypes) {
  var Misc = sequelize.define("tbl_misc", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    miscCode: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: 'misc_unique_key',
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    miscName: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: 'misc_unique_key',
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    miscDesc: {
      type: DataTypes.STRING(50),
      validate: {
        is: /^[a-z0-9_. ]{3,50}$/i
      }
    },
    miscVariable: {
      type: DataTypes.STRING(400),
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
    tableName: 'tbl_misc'
  }, {
    uniqueKeys: {
      misc_unique_key: {
        fields: ['miscCode', 'miscName']
      }
    }
  })

  return Misc
}
