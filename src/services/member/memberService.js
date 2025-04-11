import db from '../../models'
import dbr from '../../models/tableR'
import dbv from '../../models/view'
import { ApiError } from '../v1/errorHandlingService'
import { memberGroupExists } from '../member/memberGroupService'
import { getDataCode } from '../loyalty/loyaltyService'
import { insertCashback } from '../posService'
import { isEmpty } from '../../utils/check'
import sequelize from '../../native/sequelize'
import { getNativeQuery } from '../../native/nativeUtils'
import nativeNPS from '../../native/member/sqlNPS'
import nativeMA from '../../native/member/sqlMemberAsset'
import nativeMOB from '../../native/member/sqlMemberMobile'
// import { getSequenceFormatByCode } from '../sequenceService'
import { getDataByStoreAndCode, increaseSequence } from '../sequencesService'

const MemberMobile = db.tmp_user_mobile
const MemberMobileAsset = db.tmp_user_mobile_asset
const MemberUnit = dbr.tbl_member_unit
const Member = dbr.tbl_member
const vwMember = dbv.vw_member
let vwMemberUnit = dbv.vw_member_unit

const memberUnitFieldsForAsset = [
  ['memberId', 'id'],
  ['id', 'memberUnitId'],
  'policeNo',
  'memberCode',
  'memberName',
  'gender',
  'address01',
  'mobileNumber',
  'memberTypeId',
  'memberTypeName',
  'memberSellPrice',
  'showAsDiscount',
  'memberPendingPayment',
]

const memberUnitFieldsForAssetSearch = [
  'policeNo',
]

const mbrFields01 = ['id', 'memberCode', 'memberName', 'memberGroupId', 'memberGroupName',
  'memberTypeId', 'memberTypeName', 'memberSellPrice', 'showAsDiscount', 'memberPendingPayment',
  'idType', 'idNo', 'address01', 'address02', 'cityId', 'cityName', 'state', 'zipCode',
  'phoneNumber', 'mobileNumber', 'email', 'birthDate', 'gender', 'taxId',
  'cashback', 'validityDate', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const mbrFields02 = [['id', 'memberId'], 'memberCode', 'memberName', 'mobileActivate']

const lastCashbackAttributes = (id) => [
  sequelize.literal(`fn_cashback_001(${id}) as "countCashback"`),
  'cashback'
]

export async function getUserCashback (id) {
  return Member.findOne({
    attributes: lastCashbackAttributes(id),
    where: {
      id
    },
    raw: true
  }).catch(er => {
    console.log(er)
  })
}

export async function syncMemberCashbackById (memberId, next) {
  let transaction
  try {
    transaction = await sequelize.transaction()

    const lastCashback = await getUserCashback(memberId)
    await updateMemberCashback(lastCashback.countCashback, memberId, transaction)
    await transaction.commit()
    return lastCashback.countCashback
  } catch (error) {
    await transaction.rollback()
    next(new ApiError(422, error + `Couldn't update.`, error))
  }
}

export async function syncMemberCashbackByCode (memberCode, next) {
  let transaction
  try {
    transaction = await sequelize.transaction()
    const memberData = await getMemberByCode(memberCode)
    if (memberData) {
      const memberId = memberData.id
      const lastCashback = await getUserCashback(memberId)
      await updateMemberCashback(lastCashback.countCashback, memberId, transaction)
      await transaction.commit()
      return lastCashback.countCashback
    }
    await transaction.rollback()
    return false
  } catch (error) {
    await transaction.rollback()
    next(new ApiError(422, error + `Couldn't update.`, error))
  }
}

export async function increaseMemberCashback (decreaseData, gettingData, resultMemberCashback, lastCashback, transaction) {
  return Member.update({
    cashback: (lastCashback + gettingData) - gettingData
  }, {
      where: {
        id: resultMemberCashback.dataValues.memberId
      },
      transaction
    })
}

export function getMemberByCode (memberCode) {
  return Member.findOne({
    where: {
      memberCode: memberCode
    },
    raw: false
  })
}

export function getMember (memberCode) {
  return Member.findOne({
    attributes: mbrFields02,
    where: {
      memberCode: memberCode
    },
    raw: false
  })
}

export function countData (query) {
  const { type, ...other } = query
  // return vwMember.findAll({
  //   attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'total']]
  // })
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all') {
      query[key] = { $iRegexp: query[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in mbrFields01) {
      const id = Object.assign(mbrFields01)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'birthDate' || id === 'validityDate' || id === 'createdAt' || id === 'updatedAt' || id === 'type')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vwMember.count({
      where: {
        $or: querying
      },
    })
  } else {
    return vwMember.count({
      where: {
        ...other
      }
    })
  }
}

export function getMembersData (query, pagination) {
  const { type, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in mbrFields01) {
      const id = Object.assign(mbrFields01)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'birthDate' || id === 'validityDate' || id === 'createdAt' || id === 'updatedAt' || id === 'type')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vwMember.findAll({
      attributes: mbrFields01,
      where: {
        $or: querying
      },
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return vwMember.findAll({
      attributes: mbrFields01,
      where: {
        ...other
      },
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function setMemberInfo (request) {
  const getMemberInfo = {
    id: request.id,
    memberCode: request.memberCode,
    memberName: request.memberName,
    memberGroupId: request.memberGroupId,
    memberTypeId: request.memberTypeId,
    idType: request.idType,
    idNo: request.idNo,
    address01: request.address01,
    address02: request.address02,
    cityId: request.cityId,
    gender: request.gender,
    state: request.state,
    zipCode: request.zipCode,
    phoneNumber: request.phoneNumber,
    mobileNumber: request.mobileNumber,
    email: request.email,
    birthDate: request.birthDate,
    cashback: request.cashback,
    validityDate: request.validityDate,
    taxId: request.taxId
  }

  return getMemberInfo
}

export function memberExists (memberCode) {
  return getMemberByCode(memberCode).then(member => {
    if (member == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function getMemberId (memberCode) {
  return getMemberByCode(memberCode).then(member => {
    if (member) {
      return member.id
    } else {
      return false
    }
  })
}

export function validateMember (membercode, member, createdBy, next) {
  if (memberGroupExists(member.memberGroup)) {
    return true
  } else {
    return false
  }
}

export function activateMobile (data, updatedBy) {
  return Member.update({
    oldMemberCode: sequelize.literal('memberCode'),
    memberCode: data.memberCardId,
    mobileActivate: 1,
    updatedBy: updatedBy
  },
    {
      where: {
        id: data.id
      }
    }
  )
}

export function checkMobileActive (id) {
  return Member.findAll({
    where: {
      memberCode: id
    },
    raw: false
  })
}

async function reArrangedCashbackInForNewMember (gettingData, pos, resultLoyalty, createdBy) {
  const dataLoyalty = {
    type: 'N',
    loyaltyId: resultLoyalty.id,
    memberId: pos.memberCode,
    minPayment: resultLoyalty.minPayment,
    maxDiscount: resultLoyalty.maxDiscount,
    loyaltySetValue: resultLoyalty.setValue,
    cashbackIn: gettingData,
    cashbackOut: 0,
    createdBy: createdBy
  }
  return dataLoyalty
}

export async function createMember (membercode, member, createdBy, next) {
  let transaction
  try {
    transaction = await sequelize.transaction()

    // if (member.memberGetDefault) {
    //   const sequence = await getSequenceFormatByCode({ seqCode: 'CUST', type: '1' })
    //   membercode = sequence
    // }

    const resultLoyalty = await getDataCode()
    let dataLoyalty
    member.cashback = 0
    if (resultLoyalty) {
      member.cashback = resultLoyalty.newMember
    }
    const resultInsert = await insertMember(membercode, member, createdBy, next, transaction)
    if (resultInsert && resultLoyalty) {
      dataLoyalty = await reArrangedCashbackInForNewMember(resultLoyalty.newMember, { memberCode: resultInsert.dataValues.id }, resultLoyalty, createdBy)
      await insertCashback(dataLoyalty, transaction)
    }
    if (member.memberGetDefault) {
      const lastSequence = await getDataByStoreAndCode('CUST', 1)
      await increaseSequence('CUST', 1, lastSequence.seqValue, transaction)
    }
    await transaction.commit()
    return resultInsert
  } catch (error) {
    await transaction.rollback()
    next(new ApiError(422, error + `Couldn't update.`, error))
  }
}

export function insertMember (membercode, member, createdBy, next, transaction) {
  if (memberGroupExists(member.memberGroup)) {
    return Member.create({
      memberCode: membercode,
      memberName: member.memberName,
      memberGroupId: member.memberGroupId,
      memberTypeId: member.memberTypeId,
      idType: member.idType,
      idNo: member.idNo,
      address01: member.address01,
      address02: member.address02,
      cityId: member.cityId,
      state: member.state,
      zipCode: member.zipCode,
      phoneNumber: member.phoneNumber,
      mobileNumber: member.mobileNumber,
      email: member.email,
      gender: member.gender,
      birthDate: member.birthDate,
      taxId: member.taxId,
      cashback: member.cashback,
      validityDate: member.validityDate,
      storeId: member.storeId,
      createdBy: createdBy,
      updatedBy: '---'
    }, { transaction })
  }
}

export function insertMemberMobileActivation (member, createdBy, transaction) {
  return Member.create({
    memberCode: member.memberCardId,
    email: member.memberEmail,
    memberName: member.memberName,
    validityDate: member.validThrough,
    mobileActivate: 1,
    memberGroupId: member.memberGroupId,
    memberTypeId: member.memberTypeId,
    idType: member.idType,
    idNo: member.idNo,
    address01: member.address01,
    mobileNumber: member.mobileNumber,
    phoneNumber: member.phoneNumber,
    cityId: member.cityId,
    gender: member.gender,
    createdBy: createdBy,
    updatedBy: '---'
  }, { transaction })
}

export function insertMemberAssetMobileActivation (data, transaction) {
  return MemberUnit.bulkCreate(data, { transaction })
}

export function activateMemberMobileActivation (member, transaction) {
  return MemberMobile.update({
    mobileActivate: 1
  }, {
      where: {
        memberCardId: member.memberCardId
      },
      transaction
    })
}

export function activateMemberActivation (member, transaction) {
  return Member.update({
    memberCode: member.memberCardId,
    oldMemberCode: member.memberCode,
    memberGroupId: member.memberGroupId,
    memberTypeId: member.memberTypeId,
    idType: member.idType,
    idNo: member.idNo,
    address01: member.address01,
    cityId: member.cityId,
    phoneNumber: member.phoneNumber,
    mobileNumber: member.mobileNumber,
    gender: member.gender,
    mobileActivate: 1
  }, {
      where: {
        memberCode: member.memberCode
      },
      transaction
    })
}

export function updateMember (membercode, member, updatedBy, next) {
  return Member.update({
    memberName: member.memberName,
    memberGroupId: member.memberGroupId,
    memberTypeId: member.memberTypeId,
    idType: member.idType,
    idNo: member.idNo,
    address01: member.address01,
    address02: member.address02,
    cityId: member.cityId,
    state: member.state,
    gender: member.gender,
    zipCode: member.zipCode,
    phoneNumber: member.phoneNumber,
    mobileNumber: member.mobileNumber,
    email: member.email,
    birthDate: member.birthDate,
    taxId: member.taxId,
    validityDate: member.validityDate,
    storeId: member.storeId,
    updatedBy: updatedBy
  },
    { where: { memberCode: membercode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export async function updateMemberCashback (cashback, memberId, transaction) {
  return Member.update({
    cashback: cashback
  }, {
      where: {
        id: memberId
      },
      transaction
    })
}

export function deleteMember (memberData) {
  return Member.destroy({
    where: {
      memberCode: memberData
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteMembers (members) {
  if (!isEmpty(members)) {
    return Member.destroy({
      where: members
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}

const stringSQL = {
  s00001: nativeNPS.sqlNPSInsert,
  s00002: nativeNPS.sqlNPSGetByMemberId,
  s00003: nativeNPS.sqlNPSGetByMemberIdDate,
  s00004: nativeMA.sqlGetMemberByAsset,
  s00005: nativeNPS.sqlNPSGetByMemberIdLastDate,
  s00006: nativeMOB.sqlActivateMobile,
  s00007: nativeMOB.sqlActivateMobileOffline,
}

export function srvAddMemberNPS (memberId, npsInfo, next) {
  const qChr = '\'', cChr = ', '
  const npsData = memberId + cChr +
    qChr + npsInfo.date + qChr + cChr +
    qChr + npsInfo.score + qChr + cChr +
    qChr + npsInfo.memo + qChr + cChr +
    'now()'
  const sSQL = stringSQL.s00001.replace("_BIND01", npsData)
  return getNativeQuery(sSQL, true, 'INSERT', next)
}

export function srvGetMemberNPSs (memberId, npsInfo, next) {
  const sSQL = stringSQL.s00002
    .replace("_BIND01", memberId)
  return getNativeQuery(sSQL, false, 'SELECT', next)
}

export function srvGetMemberNPS (memberId, npsInfo, next) {
  const sSQL = stringSQL.s00003
    .replace("_BIND01", memberId)
    .replace("_BIND02", npsInfo)
  return getNativeQuery(sSQL, true, 'SELECT', next)
}

export function getNextNPSDate (memberId, next) {
  return srvGetMemberNPSLastDate(memberId).then(member => {
    let nextNPSDate
    const npsNextScore = JSON.parse(member.nextScoreDate)
    const lastNPSDate = new Date(member.lastDate)
    if ((npsNextScore.unit) === 'year') {
      nextNPSDate = new Date(new Date(lastNPSDate).setFullYear(lastNPSDate.getFullYear() + npsNextScore.value))
    }
    else if ((npsNextScore.unit) === 'month') {
      nextNPSDate = new Date((new Date(lastNPSDate).setMonth(lastNPSDate.getMonth() + npsNextScore.value)))
    }
    else if ((npsNextScore.unit) === 'day') {
      nextNPSDate = new Date(new Date(lastNPSDate).setDate(lastNPSDate.getDate() + npsNextScore.value))
    }
    else {
      nextNPSDate = new Date(new Date(lastNPSDate).setMonth(lastNPSDate.getMonth() + 6))
    }
    return { last: member.lastDate, next: nextNPSDate.toISOString().slice(0, 10) }
  }).catch(err => new ApiError(400, err, err))
}

export function isMemberValidNPS (memberId, npsLastDate) {
  return getNextNPSDate(memberId).then(npsDate => {
    if (npsDate.last) {
      if (new Date(npsLastDate) >= npsDate.next) {
        return { valid: true, last: npsDate.last, next: npsDate.next }
      } else {
        return { valid: false, last: npsDate.last, next: npsDate.next }
      }
    } else {
      return { valid: true, last: npsDate.last, next: npsDate.next }
    }
  })
}

export function srvGetMemberNPSLastDate (memberId, next) {
  const sSQL = stringSQL.s00005
    .replace("_BIND01", memberId)
  return getNativeQuery(sSQL, true, 'SELECT', next)
}

export function countDataMemberAsset (query) {
  const { type, field, order, q, ...other } = query
  for (let key in memberUnitFieldsForAssetSearch) {
    key = memberUnitFieldsForAssetSearch[key]
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { $iRegexp: q }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in memberUnitFieldsForAssetSearch) {
      const id = Object.assign(memberUnitFieldsForAssetSearch)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = { $iRegexp: query['q'] }
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vwMemberUnit.count({
      where: {
        $or: querying,
        $and: other
      },
    })
  } else {
    return vwMemberUnit.count({
      where: {
        ...other,
      }
    })
  }
}

export function getDataMemberAsset (query, pagination) {
  const { type, field, order, q, ...other } = query
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in memberUnitFieldsForAssetSearch) {
      const id = Object.assign(memberUnitFieldsForAssetSearch)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = { $iRegexp: query['q'] }
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vwMemberUnit.findAll({
      attributes: memberUnitFieldsForAsset,
      where: {
        $or: querying,
        $and: other
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return vwMemberUnit.findAll({
      attributes: query.field ? query.field.split(',') : memberUnitFieldsForAsset,
      where: {
        ...other,
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function srvGetMemberByAsset (searchterm, next) {
  const qChr = '\'', cChr = ', '
  const mapping = JSON.parse(JSON.stringify(searchterm)
    .replace("\"brand\":", "\"merk\":")
    .replace("\"license\":", "\"policeNo\":")
    .replace("\"chassis\":", "\"chassisNo\":")
    .replace("\"engine\":", "\"machineNo\":")
  )
  let term = ''
  Object.keys(mapping).forEach(function (key) {
    term = term + key + ' like ' + qChr + '%' + mapping[key] + '%' + qChr + ' AND '
  })
  term = term.slice(0, -5)
  const sSQL = stringSQL.s00004
    .replace("_BIND01", term)
  return getNativeQuery(sSQL, false, 'SELECT', next)
}

export function getMemberMobileById (id) {
  return MemberMobile.findOne({
    attributes: ['memberCardId', 'memberEmail', 'memberName', 'memberPoint', 'validThrough'],
    where: {
      memberCardId: id
    },
    raw: false
  })
}

export function getMobileActivateStatus (memberCode) {
  return Member.findOne({
    attributes: ['id', 'mobileActivate'],
    where: {
      memberCode
    },
    raw: false
  })
}

export function getAllMemberMobileAssetById (id) {
  return MemberMobileAsset.findAll({
    attributes: [
      'policeNo',
      'merk',
      'model',
      'type',
      'year',
      'chassisNo',
      'machineNo',
      'createdBy',
      'createdAt'
    ],
    where: {
      memberCardId: id
    },
    raw: false
  })
}

export async function srvActivateMobile (mode, data, by, next) {
  let sSQL
  let dataLoyalty
  if (mode === 'mobile') {
    // sSQL = stringSQL.s00006
    //   .replace("_BIND01", data.memberId)
    //   .replace("_BIND02", by)
    let transaction
    try {
      transaction = await sequelize.transaction()
      const dataMemberCardId = await getMemberMobileById(data.memberId)
      const resultInsertMobile = await insertMemberMobileActivation({
        ...dataMemberCardId,
        memberCode: data.memberCode,
        memberGroupId: data.memberGroupId,
        memberTypeId: data.memberTypeId,
        idType: data.idType,
        idNo: data.idNo,
        address01: data.address01,
        cityId: data.cityId,
        phoneNumber: data.phoneNumber,
        mobileNumber: data.mobileNumber,
        gender: data.gender,
      }, by, transaction)
      await activateMemberMobileActivation(dataMemberCardId, transaction)
      const dataMemberAssets = await getAllMemberMobileAssetById(data.memberId)
      await insertMemberAssetMobileActivation(dataMemberAssets.map(x => {
        return {
          memberId: resultInsertMobile.dataValues.id,
          createdBy: by,
          ...x,
        }
      }), transaction)
      const resultLoyalty = await getDataCode()
      let dataResultInsert = false

      if (resultInsertMobile && resultLoyalty) {
        dataLoyalty = await reArrangedCashbackInForNewMember(resultLoyalty.newMember, { memberCode: resultInsertMobile.dataValues.id }, resultLoyalty, by)
        await insertCashback(dataLoyalty, transaction)
      }
      await transaction.commit()

      if (resultInsertMobile) {
        dataResultInsert = {
          memberCode: resultInsertMobile.dataValues.memberCode,
          memberName: resultInsertMobile.dataValues.memberName,
          mobileActivate: resultInsertMobile.dataValues.mobileActivate
        }
      }
      return dataResultInsert
    } catch (error) {
      await transaction.rollback()
      next(new ApiError(422, error + `Couldn't insert data.`, error))
    }
  } else if (mode === 'offline') {
    // sSQL = stringSQL.s00007
    //   .replace("_BIND01", data.memberCode)
    //   .replace("_BIND02", data.memberId)
    //   .replace("_BIND03", by)
    let transaction
    try {
      transaction = await sequelize.transaction()

      const dataMemberCardId = await getMemberMobileById(data.memberId)
      const mobileActivateStatus = await getMobileActivateStatus(data.memberCode)

      if (!mobileActivateStatus || mobileActivateStatus.mobileActivate === '1') {
        return false
      }

      if (!dataMemberCardId) {
        return false
      }

      const resultLoyalty = await getDataCode()

      dataMemberCardId.memberCode = data.memberCode

      await activateMemberActivation({
        ...data,
        ...dataMemberCardId
      }, transaction)

      await activateMemberMobileActivation(dataMemberCardId, transaction)

      const dataMemberAssets = await getAllMemberMobileAssetById(data.memberId)
      await insertMemberAssetMobileActivation(dataMemberAssets.map(x => {
        return {
          memberId: mobileActivateStatus.id,
          createdBy: by,
          ...x,
        }
      }), transaction)
      // const resultInsertMobile = await insertMemberMobileActivation(dataMemberCardId, by, transaction)
      let dataResultInsert
      if (dataMemberCardId) {
        dataResultInsert = {
          memberCode: dataMemberCardId.memberCardId,
          memberName: dataMemberCardId.memberName,
        }
      }
      if (resultLoyalty) {
        dataLoyalty = await reArrangedCashbackInForNewMember(resultLoyalty.newMember, { memberCode: mobileActivateStatus.id }, resultLoyalty, by)
        await insertCashback(dataLoyalty, transaction)
      }
      await transaction.commit()
      return dataResultInsert
    } catch (error) {
      await transaction.rollback()
      next(new ApiError(422, error + `Couldn't insert data.`, error))
    }

  } else {
    console.log('srvActivateMobile: ', 'param mode - out of range')
    return false
  }
  return getNativeQuery(sSQL, false, 'SELECT', next)
}
