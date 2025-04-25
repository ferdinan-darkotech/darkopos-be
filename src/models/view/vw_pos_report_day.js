"use strict";
import moment from 'moment'

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("vw_pos_report_day", {
    transdate: {
      type: DataTypes.STRING,
      get() {
        return moment(this.getDataValue('transDate')).format('YYYY-MM-DD');
      }
    },
    storeid: { type: DataTypes.INTEGER },
    data: { type: DataTypes.JSON },
    detail: { type: DataTypes.JSON },
    edc: { type: DataTypes.JSON }
  }, {tableName: 'vw_pos_report_day'})
  return Pos
}
