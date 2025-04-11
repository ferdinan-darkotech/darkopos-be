"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var woDetail = sequelize.define("vw_wo_detail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    woid: { type: DataTypes.INTEGER },
    wono: { type: DataTypes.INTEGER },
    storeid: { type: DataTypes.INTEGER },
    storecode: { type: DataTypes.STRING },
    storename: { type: DataTypes.STRING },
    memberid: { type: DataTypes.INTEGER },
    membercode: { type: DataTypes.STRING },
    membername: { type: DataTypes.STRING },
    policenoid: { type: DataTypes.INTEGER },
    policeno: { type: DataTypes.STRING },
    timein: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('timein')).format('YYYY-MM-DD hh:mm:ss');
      }
    },
    gasoline_percent: { type: DataTypes.DECIMAL(19, 2) },
    vehicle_km: { type: DataTypes.DECIMAL(19, 2) },
    takeaway: { type: DataTypes.INTEGER },
    current_duplicate: { type: DataTypes.INTEGER },
    total_duplicate: { type: DataTypes.INTEGER },
    checks: { type: DataTypes.JSON },
    custome: { type: DataTypes.JSON }
  }, {
      tableName: 'vw_wo_detail'
    }, {
      freezeTableName: true
    })

  woDetail.removeAttribute('id');
  return woDetail
}