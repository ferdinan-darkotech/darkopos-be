"use strict";

module.exports = function (sequelize, DataTypes) {
  var Supplier = sequelize.define("tbl_supplier", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    supplierCode: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_]{2,15}$/i
      }
    },
    supplierName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // validate: {
      //   is: /^[a-z0-9\_\- ]{3,50}$/i
      // }
    },
    paymentTempo: {
      type: DataTypes.INTEGER(5)
    },
    address01: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // validate: {
      //   is: /^[A-Za-z0-9-._/ ]{5,50}$/i
      // }
    },
    address02: {
      type: DataTypes.STRING(50)
    },
    // cityId: {
    //   type: DataTypes.INTEGER(10),
    //   allowNull: false,
    // },
    kelid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(30),
      validate: {
        is: /^[a-z0-9\_\-]{3,20}$/i
      }
    },
    zipCode: {
      type: DataTypes.STRING(10),
      validate: {
        is: /^[a-z0-9\_\-]{3,20}$/i
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      validate: {
        is: /^\(?(0[0-9]{2,3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{3,5})$/
      }
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(30),
    },
    taxId: {
      type: DataTypes.STRING(15)
    },
    type_supplier: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: 'N'
    },
    default_tax_type: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: 'E'
    },
    default_tax_value: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: 0
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
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
      tableName: 'tbl_supplier'
    })

  return Supplier
}