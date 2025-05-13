import tb from '../../../../models/tableR'
import vw from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { remapFilter } from '../../../../native/sequelizeOp'
import { isEmptyObject } from '../../../../utils/operate/objOpr'
import { switchModeField } from '../../function/srvUtils'
import moment from 'moment'

const table = tb.tbl_member_group

const idField = ['id']
const lovFields01 = [
  ['groupCode', 'value'],
  ['groupName', 'key']
]
const minFields01 = [
  'groupCode',
  'groupName'
]
const minFields02 = [
  'id',
  'groupCode',
  'groupName'
]
const mainFields = [
  'groupCode', 'groupName', 'pendingPayment', 'active',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const mainViewFields = mainFields

export async function srvGetCustomerGroups (query, filter = false) {
  let { pageSize, page, order, q, ...other } = query
  let sort = (order) ? getSelectOrder(order) : [['id', 'DESC']]
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
  let attributes = minFields02
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

export async function srvGetCustomerGroupByCode (groupCode, query = {}) {
  let { pageSize, page, order, q, ...other } = query
  let attributes = minFields01
  let where = { groupCode }
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

export async function srvGetCustomerGroupById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: false
  })
}

export function srvCustomerGroupExist (groupCode) {
  return srvGetCustomerGroupByCode(groupCode).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateCustomerGroup (data, createdBy, next) {
  return table.create({
    groupCode: data.groupCode,
    groupName: data.groupName,
    pendingPayment: +(data.pendingPayment || 0),
    active: data.active,
    createdBy: createdBy,
    createdAt: moment()
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCG-00001'
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateCustomerGroup (data, updatedBy, next) {
  
  return table.update({
    groupName: data.groupName,
    pendingPayment: +(data.pendingPayment || 0),
    active: data.active,
    updatedBy: updatedBy,
    updatedAt: moment()
  }, {
    where: {
      groupCode: data.code
    }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCG-00002'
    next(new ApiError(400, other, err))
  })
}

export function srvDeleteCustomerGroup (groupCode, next) {
  return table.destroy({
    where: { groupCode }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCG-00003'
    next(new ApiError(400, err, err))
  })
}