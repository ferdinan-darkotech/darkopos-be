import { Op } from 'sequelize'
import db from '../../models/tableR'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'

let MemberUnit = db.tbl_member_unit
let vwMemberUnit = dbv.vw_member_unit

const memberUnitFields = [
  'id',
  'memberId',
  'memberCode',
  'memberName',
  'gender',
  'birthDate',
  'cityName',
  'address01',
  'address02',
  'mobileNumber',
  'phoneNumber',
  'memberTypeId',
  'memberTypeName',
  'memberSellPrice',
  'showAsDiscount',
  'memberPendingPayment',
  'cashback',
  'policeNo',
  'merk',
  'model',
  'type',
  'brandid',
  'modelid',
  'typeid',
  'year',
  'chassisNo',
  'machineNo',
  'expired',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

const memberUnitFieldsAll = [
  'memberId',
  'memberCode',
  'memberName',
  'policeNo',
  'merk',
  'model',
  'type',
  'year',
  'chassisNo',
  'machineNo',
  'expired'
]

export function getMemberUnitByPoliceCode (membercode, memberunit) {
  return vwMemberUnit.findOne({
    attributes: memberUnitFields,
    where: {
      memberCode: membercode,
      policeNo: memberunit
    },
    raw: true
  })
}


export function getMemberUnitByPoliceNo (memberid, memberunit) {
  return vwMemberUnit.findOne({
    attributes: memberUnitFields,
    where: {
      memberId: memberid,
      policeNo: memberunit
    },
    raw: false
  })
}

export function setMapLov (request) {
  console.log('setMapLov', request)
  const m = { id: 'value', positionName: 'label' }
  const getMiscLov = o => Object.assign(...Object.keys(o).map(k => ({ [m[k] || k]: o[k] })))
  console.log('setMapLov', request.map(getMiscLov))
  return request.map(getMiscLov)
}

export function getMemberUnitsAllData () {
  return vwMemberUnit.findAll({
    attributes: memberUnitFieldsAll
  })
}

export function getMemberUnitsData (membercode, query) {
  console.log('getMemberUnitsData', query)
  if (query) {
    for (let key in query) {
      if (key === 'createdAt') {
        query[key] = { [Op.between]: query[key] }
      }
    }
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'employeeId')
      query = JSON.parse(str)
      return vwMemberUnit.findAll({
        attributes: memberUnitFields,
        where: query
      })
    } else if (query.hasOwnProperty('fields')) {
      if (query.hasOwnProperty('for') && query.for === 'pos') {
        // lov for filter employee that not a user
        return vwMemberUnit.findAll({
          attributes: query.fields.split(','),
          where: { memberCode: membercode },
        })
      } else {
        return vwMemberUnit.findAll({
          attributes: query.fields.split(','),
          where: {
            memberCode: membercode
          }
        })
      }
    } else {
      return vwMemberUnit.findAll({
        attributes: memberUnitFields,
        where: {
          memberCode: membercode
        }
      })
    }
  } else {
    return vwMemberUnit.findAll({
      attributes: memberUnitFields,
      where: {
        memberCode: membercode
      }
    })
  }
}

export function getMemberUnitsByCode (memberCode) {
  return vwMemberUnit.findAll({
    attributes: memberUnitFields,
    where: {
      memberCode: memberCode
    },
    raw: false
  })
}

export function setMemberUnitInfo (request) {
  const getMemberUnitInfo = {
    memberCode: request.memberCode,
    policeNo: request.policeNo,
    merk: request.merk,
    model: request.model,
    type: request.type,
    year: request.year,
    chassisNo: request.chassisNo,
    machineNo: request.machineNo,
    expired: request.expired,
  }

  return getMemberUnitInfo
}

export function memberUnitExists (memberCode, policeNo) {
  return getMemberUnitByPoliceNo(memberCode, policeNo).then(member => {
    if (member === null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createMemberUnit (memberId, policeNo, memberunit, createdBy, next) {
  return MemberUnit.create({
    memberId: memberId,
    policeNo: policeNo,
    merk: memberunit.merk,
    model: memberunit.model,
    type: memberunit.type,
    year: memberunit.year,
    chassisNo: memberunit.chassisNo,
    machineNo: memberunit.machineNo,
    expired: memberunit.expired,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateMemberUnit (memberId, policeno, memberunit, updatedBy, next) {
  return MemberUnit.update({
    merk: memberunit.merk,
    model: memberunit.model,
    type: memberunit.type,
    year: memberunit.year,
    chassisNo: memberunit.chassisNo,
    machineNo: memberunit.machineNo,
    expired: memberunit.expired,
    updatedBy: updatedBy
  },
    { where: { memberId: memberId, policeNo: policeno } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function updateMemberUnitById (id, memberunit, updatedBy, next) {
  return MemberUnit.update({
    policeNo: memberunit.policeNo,
    merk: memberunit.merk,
    model: memberunit.model,
    type: memberunit.type,
    year: memberunit.year,
    chassisNo: memberunit.chassisNo,
    machineNo: memberunit.machineNo,
    expired: memberunit.expired,
    updatedBy: updatedBy
  },
    { where: { id } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteMemberUnit (memberId, policeno) {
  return MemberUnit.destroy({
    where: {
      memberId: memberId,
      policeNo: policeno
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteMemberUnits (members) {
  if (!isEmpty(members)) {
    return MemberUnit.destroy({
      where: members
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
