"use strict";

module.exports = function (sequelize, DataTypes) {
  var JobPosition = sequelize.define("tbl_job_position", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    positionCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_]{3,5}$/i
      }
    },
    positionName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_ ]{1,50}$/i
      }
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
    tableName: 'tbl_job_position'
  })

  return JobPosition
}