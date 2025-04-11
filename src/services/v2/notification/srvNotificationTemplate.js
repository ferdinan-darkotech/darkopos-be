import tb from '../../../models/tableR'
import vw from '../../../models/viewR'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../native/nativeUtils'
import { remapFilter } from '../../../native/sequelizeOp'
import { isEmptyObject } from '../../../utils/operate/objOpr'
import { switchModeField } from '../function/srvUtils'

const table = tb.tbl_notification_template
const view = vw.vwi_notification_template_003

const idField = ['id']
const lovFields01 = [
  ['code', 'value'],
  ['name', 'key']
]
const minFields01 = [
  'code',
  'name'
]
const minFields02 = [
  'id',
  'code',
  'typeId',
  'groupId'
]
const minFields03 = [
  'code',
  'name'
]
const mainFields = [
  'code', 'name', 'typeId', 'groupId', 'status', 'content',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const mainViewFields = [
  'code', 'name', 'typeId', 'typeCode', 'typeName',
  'groupId', 'groupCode', 'groupName', 'status', 'content',
  'timerName', 'timerPattern',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

export async function srvGetNotificationTemplates (query, filter = false) {
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
  return view.findAndCountAll({
    attributes,
    where,
    order: sort,
    ...limitQuery,
    raw: false
  })
}

export async function srvGetNotificationTemplateByCode (code, query = {}) {
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

export async function srvGetNotificationTemplateById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: true
  })
}

export function srvNotificationTemplateExist (code) {
  return srvGetNotificationTemplateByCode(code).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateNotificationTemplate (data, createdBy, next) {
  return table.create({
    code: data.code,
    name: data.name,
    typeId: data.typeId,
    groupId: data.groupId,
    status: data.status,
    content: data.content,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSNP-00001'
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateNotificationTemplate (data, updatedBy, next) {
  return table.update({
    name: data.name,
    typeId: data.typeId,
    groupId: data.groupId,
    status: data.status,
    content: data.content,
    updatedBy: updatedBy
  }, {
    where: {
      code: data.code
    }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSNP-00002'
    next(new ApiError(400, other, err))
  })
}

export function srvDeleteNotificationTemplate (code, next) {
  return table.destroy({
    where: { code }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSNP-00003'
    next(new ApiError(400, err, err))
  })
}
