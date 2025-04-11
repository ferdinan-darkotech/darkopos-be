import tb from '../../../../models/tableR'
import vw from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { remapFilter } from '../../../../native/sequelizeOp'
import { isEmptyObject } from '../../../../utils/operate/objOpr'
import { switchModeField } from '../../function/srvUtils'
import moment from 'moment'

const table = tb.tbl_member_type


const idField = ['id']
const lovFields01 = [
  ['typeCode', 'value'],
  ['typeName', 'key']
]
const minFields01 = [
  'typeCode',
  'typeName'
]
const minFields02 = [
  'id',
  'typeCode',
  'typeName'
]
const mainFields = [
  'typeCode', 'typeName', 'discPct01', 'discPct02', 'discPct03', 'discNominal', 'sellPrice',
  'active', 'showAsDiscount', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const mainViewFields = mainFields

export async function srvGetCustomerTypes (query, filter = false) {
  let { pageSize, page, order, q, ...other } = query
  let sort = (order) ? getSelectOrder(order) : null
  const { m, activeOnly, ...condition } = other
  const includeActive = (activeOnly || '').toString() === 'true' ? { active: true } : {}
  let where = { ...includeActive } // let where = { deletedAt: { [Op.eq]: null } }

  if (filter && !isEmptyObject(condition)) {
    where = [...remapFilter(condition), includeActive]
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
    if (mode.includes('mid')) modeField = 'mid'
  }

  let attributes = minFields01
  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minFields01; break
    case 'lov': attributes = lovFields01; break
    case 'mid': attributes = minFields02; break
    default: attributes = minFields01
  }

  return table.findAndCountAll({
    attributes,
    where,
    order: sort,
    ...limitQuery,
    raw: false
  })
}

export async function srvGetCustomerTypeByCode (typeCode, query = {}) {
  let { pageSize, page, order, q, ...other } = query
  let attributes = minFields01
  let where = { typeCode }
  const modeField = switchModeField(other)

  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minFields01; break
    case 'getid': attributes = idField; break
    default: attributes = minFields01
  }
  // if sdel = show deleted row
  // if (modeField === 'sdel') delete where.deletedAt

  return table.findOne({
    attributes,
    where,
    raw: false
  })
}

export async function srvGetCustomerTypeById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: false
  })
}

export function srvCustomerTypeExist (typeCode) {
  return srvGetCustomerTypeByCode(typeCode).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateCustomerType (data, createdBy, next) {
  return table.create({
    typeCode: data.typeCode,
    typeName: data.typeName,
    discPct01: data.discPct01,
    discPct02: data.discPct02,
    discPct03: data.discPct03,
    discPct03: data.discPct03,
    discNominal: data.discNominal,
    sellPrice: data.sellPrice,
    showAsDiscount: +(data.showAsDiscount || 0),
    active: data.active,
    createdBy: createdBy,
    createdAt: moment(),
    updatedBy: '---',
    updatedAt: moment()
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCG-00001'
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateCustomerType (data, updatedBy, next) {
  return table.update({
    typeName: data.typeName,
    discPct01: data.discPct01,
    discPct02: data.discPct02,
    discPct03: data.discPct03,
    discPct03: data.discPct03,
    discNominal: data.discNominal,
    sellPrice: data.sellPrice,
    showAsDiscount: +(data.showAsDiscount || 0),
    active: data.active,
    updatedBy: updatedBy,
    updatedAt: moment()
  }, {
    where: {
      typeCode: data.code
    }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCG-00002'
    next(new ApiError(400, other, err))
  })
}

export function srvDeleteCustomerType (typeCode, next) {
  return table.destroy({
    where: { typeCode }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCG-00003'
    next(new ApiError(400, err, err))
  })
}