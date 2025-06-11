"use strict";

module.exports = function (sequelize, DataTypes) {
  var Member = sequelize.define("tbl_member", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    memberCode: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_-]{3,16}$/i
      }
    },
    mobileActivate: {
      type: DataTypes.STRING(1)
    },
    oldMemberCode: {
      type: DataTypes.STRING(16),
      allowNull: true,
      unique: true
    },
    memberName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        // is: /^[a-z0-9\_.,\- ]{3,50}$/i
        is: /^[a-z0-9_. /!@#$%^&*~,-]{3,50}$/i
      }
    },
    membercategoryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memberGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memberTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idType: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   is: /^[a-z0-9\_\-]{3,10}$/i
      // }
    },
    idNo: {
      type: DataTypes.STRING(30),
      // allowNull: false,
    },
    address01: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address02: {
      type: DataTypes.STRING
    },
    npwp_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
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
        is: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    mobileNumber: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(40)
    },
    birthDate: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.STRING(1),
    },
    taxId: {
      type: DataTypes.STRING(15)
    },
    cashback: {
      type: DataTypes.INTEGER
    },
    validityDate: {
      type: DataTypes.STRING(17),
    },
    memberstoreid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    verifications: {
      type: DataTypes.JSON,
      allowNull: true
    },
    dept_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\_\-]{3,30}$/i
      }
    },
    verification_status: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    verif_request_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verif_approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },

    // [ITCF MEMBER]: FERDINAN - 2025-04-21
    referralcode: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // [16 DIGIT TAX ID]: FERDINAN - 2025-06-11
    newtaxid: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    taxdigit: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
      tableName: 'tbl_member'
    })

  return Member
}