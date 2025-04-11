"use strict";

module.exports = function (sequelize, DataTypes) {
  var Pos = sequelize.define("vw_pos_report_trans", {
    storeId: { type: DataTypes.INTEGER  },
    transDate: { type: DataTypes.DATE  },
    name: { type: DataTypes.STRING  },
    title: { type: DataTypes.STRING  },
    sales: { type: DataTypes.NUMERIC  },
    service: { type: DataTypes.NUMERIC  }
  }, { tableName: 'vw_pos_report_trans' })
  return Pos
}
