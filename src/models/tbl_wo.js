"use strict";

module.exports = function (sequelize, DataTypes) {
  var Table = sequelize.define("tbl_wo", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    woNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    timeIn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    vehicle_km: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true,
      defaultValue: 0
    },
    gasoline_percent: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true,
      defaultValue: 0
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    policeNoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    takeAway: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    current_duplicate: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    total_duplicate: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: true
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
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    // [NEW]: FERDINAN - 2025-02-27
    employeecode: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    noreference: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    drivername: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
  }, {
      tableName: 'tbl_wo',
      paranoid: true
    })

  return Table
}