import tb from '../../../../models/tableR'
import vw from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { remapFilter } from '../../../../native/sequelizeOp'
import { isEmptyObject } from '../../../../utils/operate/objOpr'
import { switchModeField } from '../../function/srvUtils'

const table = tb.tbl_social_media
// const view = vw.vwi_employee_001

const idField = ['id']
const lovFields01 = [
  ['code', 'value'],
  ['name', 'key']
]
const minFields01 = [
  'code',
  'url'
]
const minFields02 = [
  'code',
  'name',
  'url'
]
const mainFields = [
  'code', 'name', 'url', 'image',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deletedAt', 'deletedBy'
]
const mainViewFields = mainFields

export async function srvGetSocialMedia (query, filter = false) {
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
  }

  let attributes = minFields01
  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minFields01; break
    case 'lov': attributes = lovFields01; break
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

export async function srvGetSocialMediaByCode (code, query = {}) {
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
    raw: false
  })
}

export async function srvGetSocialMediaById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: false
  })
}

export function srvSocialMediaExist (code) {
  return srvGetSocialMediaByCode(code).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateSocialMedia (data, createdBy, next) {
  return table.create({
    code: data.code,
    name: data.name,
    url: data.url,
    image: data.image,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSSM-00001'
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateSocialMedia (data, updatedBy, next) {
  return table.update({
    name: data.name,
    url: data.url,
    image: data.image,
    updatedBy: updatedBy
  }, {
    where: {
      code: data.code
    }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSSM-00002'
    next(new ApiError(400, other, err))
  })
}

export function srvDeleteSocialMedia (code, next) {
  return table.destroy({
    where: { code }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSSM-00003'
    next(new ApiError(400, err, err))
  })
}