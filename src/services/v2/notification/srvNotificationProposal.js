import tb from '../../../models/tableR'
import vw from '../../../models/viewR'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../native/nativeUtils'
import { remapFilter } from '../../../native/sequelizeOp'
import { isEmptyObject } from '../../../utils/operate/objOpr'
import { switchModeField } from '../function/srvUtils'

const table = tb.tbl_notification_proposal
const view = vw.vwi_notification_proposal_005
const viewSpecific = vw.vwi_notification_proposal_006

const idField = ['id']
const lovFields01 = [
  ['code', 'value'],
  ['referenceId', 'key']
]
const minFields01 = [
  'id',
  'code',
  'referenceId'
]
const minFields02 = [
  'code',
  'referenceId',
  'dataContact'
]
const minFields03 = [
  'id', 'code', 'storeId', 'dataContact', 'dataKey', 'dataDate', 'dataInfo', 'status', 'contentText',
]
const mainFields = [
  'id', 'code', 'referenceId', 'storeId', 'dataContact', 'dataKey', 'dataDate', 'dataInfo', 'status', 'content',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const mainViewFields = mainFields

export async function srvGetNotificationProposals (query, filter = false) {
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

export async function srvGetNotificationProposalByCode (code, query = {}) {
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

export async function srvGetNotificationProposalById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: true
  })
}

export async function srvGetNotificationProposalByStoreKey (storeId, dataKey) {
  return viewSpecific.findOne({
    attributes: minFields03,
    where: { storeId, dataKey },
    raw: true
  })
}


export function srvNotificationProposalExist (id) {
  return srvGetNotificationProposalById(id).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateNotificationProposal (data, createdBy, next) {
  return table.create({
    referenceId: data.referenceId,
    code: data.code,
    storeId: data.storeId,
    dataContact: data.dataContact,
    dataKey: data.dataKey,
    dataDate: data.dataDate,
    dataInfo: data.dataInfo,
    status: data.status,
    content: data.content,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSNS-00001'
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateNotificationProposal (data, updatedBy, next) {
  return table.update({
    referenceId: data.referenceId,
    code: data.code,
    storeId: data.storeId,
    dataContact: data.dataContact,
    dataKey: data.dataKey,
    dataDate: data.dataDate,
    dataInfo: data.dataInfo,
    status: data.status,
    updatedBy: updatedBy
  }, {
    where: {
      id: data.id
    }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSNS-00002'
    next(new ApiError(400, other, err))
  })
}

export function srvDeleteNotificationProposal (id, next) {
  return table.destroy({
    where: { id }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSNS-00003'
    next(new ApiError(400, err, err))
  })
}
