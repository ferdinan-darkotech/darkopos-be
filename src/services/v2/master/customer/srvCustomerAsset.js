import tb from '../../../../models/tableR'
import vw from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { Op, remapFilter } from '../../../../native/sequelizeOp'
import { isEmptyObject, checkJSONValid } from '../../../../utils/operate/objOpr'
import { switchModeField } from '../../function/srvUtils'
import { srvGetCustomerByCode } from './srvCustomerList'
import { setDefaultQuery } from '../../../../utils/setQuery'
import moment from 'moment'
import { Op as OpSequelize } from 'sequelize'

const table = tb.tbl_member_unit
const view = vw.vw_member_asset

const idField = ['id']
const lovFields01 = [ ['policeNo', 'value'], ['merk', 'key'] ]
const minFields01 = [ 'policeNo', 'merk' ]
const minViewFields01 = [ 'memberCode', 'policeNo', 'merk', 'active' ]
const mainFields = [
  'id', 'memberId', 'memberCode', 'memberName', 'address01', 'address02', 'cashback', 'mobileNumber', 'phoneNumber', 'policeNo',
  'merk', 'model', 'type', 'brandid', 'modelid', 'typeid', 'year', 'chassisNo', 'machineNo', 'expired', 'showAsDiscount', 'active',
  'memberSellPrice', 'memberTypeCode', 'memberTypeName', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deletedAt', 'deletedBy'
]

const mainFieldsV2 = [
  'membercode', 'membername', 'address01', 'address02', 'cashback', 'mobilenumber', 'phonenumber', 'policeno', 'merk', 'model', 'type', 'active',
  'brandid', 'modelid', 'typeid', 'year', 'chassisno', 'machineno', 'expired', 'showasdiscount', 'membersellprice', 'membertypecode', 'membertypename'
]
const mainViewFields = [
  'policeNo', 'merk', 'model', 'type', 'brandid', 'modelid', 'typeid', 'year', 'chassisNo',
  'active', 'machineNo', 'expired', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

let detailMsg = [
  { title: 'Please provide member', detail: [{ code: 'ZSCA-0001', message: 'No member'}] },
  { title: 'Please provide correct member', detail: [{ code: 'ZSCA-0002', message: 'Not correct member'}] },
  { title: 'Please provide asset no', detail: [{ code: 'ZSCA-0003', message: 'No asset no'}] },
]
let member = { id: null }

export function srvGetAsset (query, rawMode = 'Y') {
  const { activeOnly, ...otherQuery } = query
  const activeStatus = (activeOnly || '').toString() === 'true' ? { active: { [OpSequelize.eq]: true } } : {}
  let queryDefault = setDefaultQuery(mainFieldsV2, otherQuery, true)
  queryDefault.where = { ...queryDefault.where, ...activeStatus }
  return view.findAndCountAll({
    attributes: rawMode === 'Y' ? mainFieldsV2 : mainFields,
    ...queryDefault,
    raw: rawMode === 'Y',
    order: [['memberCode', 'DESC']]
  })
}

export function srvGetAssetByPoliceNo (policeNo, activeOnly = false) {
  const activeStatus = activeOnly ? { active: { [OpSequelize.eq]: true } } : {}
  return view.findOne({
    attributes: mainFieldsV2,
    where: { policeNo, ...activeStatus },
    raw: true
  })
}

export function srvGetAssetByMemberAndNo (membercode, policeno, activeOnly = false) {
  const activeStatus = activeOnly ? { active: { [OpSequelize.eq]: true } } : {}
  return view.findOne({
    attributes: ['id', 'memberid', ...mainFieldsV2],
    where: { membercode, policeno, ...activeStatus },
    raw: true
  })
}

export async function srvGetCustomerAssets (params, query, filter = false) {
  let { code: memberCode } = params
  let { pageSize, page, order, q, ...other } = query
  const { m, activeOnly, ...condition } = other
  let sort = (order) ? getSelectOrder(order) : null
  const members = memberCode === 'ALL' ? {} : { memberCode }
  let where = {
    ...members,
    ...(other.policeNo && !filter ? { policeNo: other.policeNo } : {}),
    deletedAt: { [OpSequelize.eq]: null },
    ...activeStatus
  } // let where = { deletedAt: { [OpSequelize.eq]: null } }
  let remapWhere = []
  const activeStatus = (activeOnly || '').toString() === 'true' ? { active: { [OpSequelize.eq]: true } } : {}
  if (filter && !isEmptyObject(condition)) {
    remapWhere = remapFilter(condition)
    for (const key in where) {
      remapWhere.push({ [key]: where[key] })
    }
    where = [remapWhere, activeStatus]
  }
  let modeField = 'min'
  let limitQuery = {
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
  }

  if (m) {
    const mode = m.split(',')
    if (mode.includes('mf')) modeField = 'main'
    if (mode.includes('bf')) modeField = 'brow'
    if (mode.includes('ar')) limitQuery = {}
    if (mode.includes('lov')) { modeField = 'lov'; limitQuery = {}; sort = [] }
    // if sdel = show deleted row
    if (mode.includes('sd')) {
      if (checkJSONValid(where)) {
        // json object
        delete where.deletedAt
      } else {
        // array object use splice
        const posIndex = where.findIndex(x=> x.hasOwnProperty('deletedAt'))
        where.splice(where.findIndex(x=> x.hasOwnProperty('deletedAt')), 1)
      }
    }
  }

  let attributes = minViewFields01
  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minViewFields01; break
    case 'lov': attributes = lovFields01; break
    default: attributes = minViewFields01
  }

  return view.findAndCountAll({
    attributes,
    where,
    order: sort,
    ...limitQuery,
    raw: false
  })
}

export async function srvGetCustomerAssetByNo (params, query = {}, mode = '') {
  let { code: memberCode, no: policeNo } = params
  let { pageSize, page, order, q, activeOnly, ...other } = query
  let attributes = minViewFields01
  const activeStatus = (activeOnly || '').toString() === 'true' ? { active: { [OpSequelize.eq]: true } } : {}

  let where = { memberCode, policeNo, deletedAt: { [OpSequelize.eq]: null }, ...activeStatus }
  if (mode === 'undelete') where.deletedAt =  { [OpSequelize.ne]: null }

  const modeField = switchModeField(other)

  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minViewFields01; break
    case 'getid': attributes = idField; break
    default: attributes = minViewFields01
  }

  // if sdel = show deleted row
  if (modeField === 'sdel') delete where.deletedAt

  return view.findOne({
    attributes,
    where,
    raw: false
  })
}

export async function srvGetCustomerAssetById (id, activeOnly = false) {
  const activeStatus = activeOnly ? { active: { [OpSequelize.eq]: true } } : {}
  return table.findOne({
    attributes: minFields01,
    where: { id, ...activeStatus },
    raw: false
  })
}

export function srvCustomerAssetExist (params, mode = '') {
  return srvGetCustomerAssetByNo(params, {}, mode).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

const validateColumns = async function (data, next) {
  if (data.hasOwnProperty('memberCode')) {
    member = await srvGetCustomerByCode(data.memberCode, { m: 'gid' })
    if (!member) {
      next(new ApiError(422, detailMsg[1].title, detailMsg[1].detail))
    }
  } else {
    next(new ApiError(422, detailMsg[0].title, detailMsg[0].detail))
  }

  if (!data.hasOwnProperty('policeNo')) {
    next(new ApiError(422, detailMsg[2].title, detailMsg[2].detail))
  }
}

export async function srvCreateCustomerAsset (data, createdBy, next) {
  await validateColumns(data, next)

  return table.create({
    memberId: member.id,
    policeNo: data.policeNo,
    merk: data.merk,
    model: data.model,
    type: data.type,
    year: data.year,
    chassisNo: data.chassisNo,
    machineNo: data.machineNo,
    expired: data.expired,
    note: data.note,
    state: data.state,
    zipCode: data.zipCode,
    mobileNumber: data.mobileNumber,
    phoneNumber: data.phoneNumber,
    email: data.email,
    birthDate: data.birthDate,
    gender: data.gender,
    taxId: data.taxId,
    modelid: data.modelid,
    typeid: data.typeid,
    brandid: data.brandid,
    active: data.active,
    createdBy: createdBy,
    createdAt: moment()
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCA-10000'
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateCustomerAsset (data, updatedBy, mode = '', next) {
  await validateColumns(data, next)
  let updatedColumns = {
    merk: data.merk,
    model: data.model,
    type: data.type,
    modelid: data.modelid,
    typeid: data.typeid,
    brandid: data.brandid,
    year: data.year,
    chassisNo: data.chassisNo,
    machineNo: data.machineNo,
    expired: data.expired,
    note: data.note,
    state: data.state,
    zipCode: data.zipCode,
    mobileNumber: data.mobileNumber,
    phoneNumber: data.phoneNumber,
    email: data.email,
    birthDate: data.birthDate,
    gender: data.gender,
    taxId: data.taxId,
    active: data.active,
    updatedBy: (mode === '') ? updatedBy : null,
    updatedAt: moment()
  }

  if (mode === 'delete') updatedColumns = { deletedBy: updatedBy }
  if (mode === 'undelete') updatedColumns = { deletedAt: null, updatedBy: updatedBy }

  return table.update(updatedColumns, {
    where: {
      memberId: member.id,
      policeNo: data.policeNo
    }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCA-10001'
    next(new ApiError(400, other, err))
  })
}

export async function srvDeleteCustomerAsset (params, next) {
  const { code: memberCode, no: policeNo } = params
  const data = { memberCode, policeNo }
  await validateColumns(data, next)

  return table.destroy({
    where: { memberId: member.id, policeNo }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCA-10002'
    next(new ApiError(400, err, err))
  })
}

export async function srvGetCustomerByAsset (params, query = {}, mode = '') {
  let { no: policeNo } = params
  let { pageSize, page, order, q, ...other } = query
  let attributes = mainViewFields
  let where = { policeNo, deletedAt: { [OpSequelize.eq]: null } }
  if (mode === 'undelete') where.deletedAt =  { [OpSequelize.ne]: null }

  const modeField = switchModeField(other)
  let limitQuery = {
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
  }

  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minViewFields01; break
    case 'getid': attributes = idField; break
    default: attributes = mainViewFields
  }

  // if sdel = show deleted row
  if (modeField === 'sdel') delete where.deletedAt

  return view.findAndCountAll({
    attributes,
    where,
    ...limitQuery,
    raw: false
  })
}
