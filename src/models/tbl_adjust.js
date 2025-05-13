"use strict";

module.exports = function (sequelize, DataTypes) {
  var Ajin = sequelize.define("tbl_adjust", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transNo: {
      type: DataTypes.STRING(25),
      allowNull: false,
      primaryKey: true,
      validate: {
        is: /^[a-z0-9\_/-]{6,25}$/i
      }
    },
    transType: {
      type: DataTypes.STRING(5),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_]{1,5}$/i
      }
    },
    transDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    picId: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    referencedate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    memo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: 1
    },
    supplierid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalprice: {
      type: DataTypes.NUMERIC(19,5),
      allowNull: true
    },
    returnstatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    totaldiscount: {
      type: DataTypes.NUMERIC(16,2),
      allowNull: true
    },
    totaldpp: {
      type: DataTypes.NUMERIC(16,2),
      allowNull: true
    },
    totalppn: {
      type: DataTypes.NUMERIC(16,2),
      allowNull: true
    },
    totalnetto: {
      type: DataTypes.NUMERIC(16,2),
      allowNull: true
    },
    totalrounding: {
      type: DataTypes.NUMERIC(16,2),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
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
      tableName: 'tbl_adjust'
    })

  return Ajin
}