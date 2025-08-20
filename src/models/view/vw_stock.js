"use strict";

module.exports = function (sequelize, DataTypes) {
  var vwStock = sequelize.define("vw_stock", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    variantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productParentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productCode: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: 'brand_unique_key',
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
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
      type: DataTypes.DECIMAL(19, 2),
    },
    sellPrice: {
      type: DataTypes.DECIMAL(19, 2),
    },
    sellPricePre: {
      type: DataTypes.DECIMAL(19, 2),
    },
    distPrice01: {
      type: DataTypes.DECIMAL(19, 2),
    },
    distPrice02: {
      type: DataTypes.DECIMAL(19, 2),
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
    brandName: {
      type: DataTypes.INTEGER,
    },
    categoryId: {
      type: DataTypes.INTEGER,
    },
    categoryName: {
      type: DataTypes.INTEGER,
    },
    trackQty: {
      type: DataTypes.BOOLEAN,
    },
    alertQty: {
      type: DataTypes.DECIMAL(6, 2),
    },
    active: {
      type: DataTypes.BOOLEAN
    },
    activeStatus: {
      type: DataTypes.STRING(10),
    },
    exception01: {
      type: DataTypes.BOOLEAN
    },
    usageTimePeriod: {
      type: DataTypes.INTEGER,
    },
    usageMileage: {
      type: DataTypes.INTEGER,
    },
    productImage: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    dummyCode: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_]{3,10}$/i
      }
    },
    dummyName: {
      type: DataTypes.STRING(60),
      allowNull: false,
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
    },

    // [MASTER STOCKS GROUP]: FERDINAN - 16/06/2025
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      tableName: 'vw_stock'
    }, {
      uniqueKeys: {
        stock_unique_key: {
          fields: ['productCode']
        }
      }
    })

  return vwStock
}
