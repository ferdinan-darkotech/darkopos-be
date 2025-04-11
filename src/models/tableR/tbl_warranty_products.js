"use strict";

module.exports = function (sequelize, DataTypes) {
  var Warranty = sequelize.define("tbl_warranty_products", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    warranty_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    warranty_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sales_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sales_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    trans_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    police_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    unit_km: {
      type: DataTypes.STRING,
      allowNull: false
    },
    by_km: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    by_period: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    list_payments: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '01'
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      tableName: 'tbl_warranty_products',
      freezeTableName: true,
      timestamps: false
    })

  Warranty.removeAttribute('id')

  return Warranty
}

