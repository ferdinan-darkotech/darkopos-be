import tb from '../../../models/tableR'
import vw from '../../../models/viewR'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../native/nativeUtils'
import { remapFilter } from '../../../native/sequelizeOp'
import { isEmptyObject } from '../../../utils/operate/objOpr'
import { switchModeField } from '../function/srvUtils'

const table = tb.tbl_notification_timer

const idField = ['id']
const lovFields01 = [
  ['id', 'id'],
  ['name', 'value'],
  ['code', 'key']
]
const minFields01 = [
  'code',
  'name',
  'pattern'
]
const minFields02 = [
  'id',
  'code',
  'name',
  'pattern'
]
const minFields03 = [
  'code',
  'name'
]
const mainFields = [
  'code', 'name', 'pattern',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const mainViewFields = mainFields

export async function srvGetNotificationTimers (query, filter = false) {
  let { pageSize, page, order, q, ...other } = query
  let sort = (order) ? getSelectOrder(order) : null
  let where = {} // let where = { deletedAt: { [Op.eq]: null } }
  const { m, ...condition } = other

  if (filter && !isEmptyObject(condition)) {
    where = remapFilter(condition)
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

export async function srvGetNotificationTimerByCode (code, query = {}) {
  let { pageSize, page, order, q, ...other } = query
  let attributes = minFields02
  let where = { code }
  const modeField = switchModeField(other)

  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'min': attributes = minFields01; break
    case 'getid': attributes = idField; break
    default: attributes = minFields02
  }

  if (modeField === 'sdel') delete where.deletedAt

  return table.findOne({
    attributes,
    where,
    raw: true
  })
}

export async function srvGetNotificationTimerById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: true
  })
}

export function srvNotificationTimerExist (code) {
  return srvGetNotificationTimerByCode(code).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateNotificationTimer (data, createdBy, next) {
  return table.create({
    code: data.code,
    name: data.name,
    pattern: data.pattern,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSNR-00001'
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateNotificationTimer (data, updatedBy, next) {
  return table.update({
    name: data.name,
    pattern: data.pattern,
    updatedBy: updatedBy
  }, {
    where: {
      code: data.code
    }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSNR-00002'
    next(new ApiError(400, other, err))
  })
}

export function srvDeleteNotificationTimer (code, next) {
  return table.destroy({
    where: { code }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSNR-00003'
    next(new ApiError(400, err, err))
  })
}