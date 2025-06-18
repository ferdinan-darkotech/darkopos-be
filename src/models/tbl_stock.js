"use strict";

module.exports = function(sequelize, DataTypes) {
  var Stock = sequelize.define("tbl_stock", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    productCode: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: 'brand_unique_key',
      validate: {
        is: /^[a-z0-9-/]{3,30}$/i
      }
    },
    productName: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    barCode01: {
      type: DataTypes.STRING(20),
    },
    barCode02: {
      type: DataTypes.STRING(20),
    },
    otherName01: {
      type: DataTypes.STRING(60),
    },
    otherName02: {
      type: DataTypes.STRING(60),
    },
    location01: {
      type: DataTypes.STRING(50),
    },
    location02: {
      type: DataTypes.STRING(50),
    },
    costPrice: {
      type: DataTypes.DECIMAL(19,2),
    },
    sellPrice: {
      type: DataTypes.DECIMAL(19,2),
    },
    sellPricePre: {
      type: DataTypes.DECIMAL(19,2),
    },
    distPrice01: {
      type: DataTypes.DECIMAL(19,2),
    },
    distPrice02: {
      type: DataTypes.DECIMAL(19,2),
    },
    sectionWidth: {
      type: DataTypes.STRING(10),
    },
    aspectRatio: {
      type: DataTypes.STRING(10),
    },
    rimDiameter: {
      type: DataTypes.STRING(10),
    },
    brandId: {
      type: DataTypes.INTEGER,
    },
    categoryId: {
      type: DataTypes.INTEGER,
    },
    trackQty: {
      type: DataTypes.TINYINT,
    },
    alertQty: {
      type: DataTypes.DECIMAL(6,2),
    },
    active: {
      type: DataTypes.TINYINT
    },
    exception01: {
      type: DataTypes.TINYINT
    },
    usageTimePeriod: {
      type: DataTypes.INTEGER,
    },
    usageMileage: {
      type: DataTypes.INTEGER,
    },
    use_warranty: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    valid_warranty_period: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    valid_warranty_km: {
      type: DataTypes.NUMERIC(19, 2),
      allowNull: true,
      defaultValue: null
    },
    productImage: {
      type: DataTypes.STRING(60),
    },
    dummyCode: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    dummyName: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    approval_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: { type: DataTypes.DATE, allowNull: true },

    // [MASTER STOCKS GROUP - ADD]: FERDINAN - 16/06/2025
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'tbl_stock'
  }, {
    uniqueKeys: {
      stock_unique_key: {
        fields: ['productCode']
      }
    }
  })

  return Stock
}