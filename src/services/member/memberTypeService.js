import db from '../../models/tableR'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'

const MemberType = db.tbl_member_type
const vwMemberType = dbv.vw_member_type
const typeFields02 = ['id', 'typeCode', 'typeName', 'discPct01', 'discPct02',
  'discPct03', 'discNominal', 'sellPrice', 'showAsDiscount'
]

export function getMemberTypeByCode (memberTypeCode) {
  return vwMemberType.findOne({
    where: {
      typeCode: memberTypeCode
    }
  })
}

export function getMemberTypesData (query) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { between: query[key] }
    }
  }
  if (query) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'memberTypeCode')
      query = JSON.parse(str)
    }
    return vwMemberType.findAll({
      attributes: typeFields02,
      where: query
    })
  } else {
    return vwMemberType.findAll({
      attributes: typeFields02
    })
  }
}

export function setMemberTypeInfo (request) {
  const getMemberTypeInfo = {
    typeCode: request.typeCode,
    typeName: request.typeName,
    discPct01: request.discPct01,
    discPct02: request.discPct02,
    discPct03: request.discPct03,
    discNominal: request.discNominal,
    sellPrice: request.sellPrice,
    showAsDiscount: request.showAsDiscount
  }

  return getMemberTypeInfo
}

export function memberTypeExists (memberTypeCode) {
  return getMemberTypeByCode(memberTypeCode).then(brand => {
    if (brand == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createMemberType (typecode, type, createdBy, next) {
  return MemberType.create({
    typeCode: typecode,
    typeName: type.typeName,
    discPct01: type.discPct01,
    discPct02: type.discPct02,
    discPct03: type.discPct03,
    discNominal: type.discNominal,
    sellPrice: type.sellPrice,
    showAsDiscount: type.showAsDiscount,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateMemberType (typecode, type, updateBy, next) {
  return MemberType.update({
    typeName: type.typeName,
    discPct01: type.discPct01,
    discPct02: type.discPct02,
    discPct03: type.discPct03,
    discNominal: type.discNominal,
    sellPrice: type.sellPrice,
    showAsDiscount: type.showAsDiscount,
    updatedBy: updateBy
  },
    { where: { typeCode: typecode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteMemberType (typecode) {
  return MemberType.destroy({
    where: {
      typeCode: typecode
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteMemberTypes (members, next) {
  if (!isEmpty(members)) {
    return MemberType.destroy({
      where: members
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
