"use strict";

module.exports = function(sequelize, DataTypes) {
  var vwMemberType = sequelize.define("vw_member_type", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    typeCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: 'type_unique_key',
      validate: {
        is: /^[a-z0-9\_]{1,5}$/i
      }
    },
    typeName: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    discPct01: {
      type: DataTypes.DOUBLE,
    },
    discPct02: {
      type: DataTypes.DOUBLE,
    },
    discPct03: {
      type: DataTypes.DOUBLE,
    },
    discNominal: {
      type: DataTypes.DOUBLE,
    },
    sellPrice: {
      type: DataTypes.DOUBLE,
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
    timestamps: false,
    freezeTableName: true
  }, {
    tableName: 'vw_member_type'
  }, {
    uniqueKeys: {
      type_unique_key: {
        fields: ['typeCode']
      }
    }
  })

  return vwMemberType
}