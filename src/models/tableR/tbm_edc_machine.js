/**
 * Created by Wi on 20180406.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
  var EDCMachine = sequelize.define("tbm_edc_machine", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    providerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    surchargeOnUs: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: true
    },
    surchargeOffUs: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: true
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
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
          is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      tableName: 'tbm_edc_machine'
  })

  return EDCMachine
}