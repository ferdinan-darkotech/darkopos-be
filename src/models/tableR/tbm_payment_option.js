/**
 * Created by Wi on 20180306.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
  var PaymentOption = sequelize.define("tbm_payment_option", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    paymentTypeId: {
      type: DataTypes.INTEGER,
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
      tableName: 'tbm_payment_option'
  })

  return PaymentOption
}