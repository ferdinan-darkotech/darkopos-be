/**
 * Created by Wi on 20180319.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
  var FinancialProvider = sequelize.define("tbm_financial_provider", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    providerType: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.CHAR,
      allowNull: false
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
      allowNull: true,
      validate: {
          is: /^[a-z0-9\_\-]{3,30}$/i
      }
    }
  }, {
      tableName: 'tbm_financial_provider'
  })

  return FinancialProvider
}