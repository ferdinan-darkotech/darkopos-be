import tb from '../../../../models/tableR'
import vw from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { remapFilter } from '../../../../native/sequelizeOp'
import { isEmptyObject } from '../../../../utils/operate/objOpr'
import { switchModeField } from '../../function/srvUtils'
import moment from 'moment'

const table = tb.tbl_city
// const view = vw.vwi_employee_001

const idField = ['id']
const lovFields01 = [
  ['cityCode', 'value'],
  ['cityName', 'key']
]
const minFields01 = [
  'cityCode',
  'cityName',

  // [STORE GET REGION]: FERDINAN - 2025-06-11
  'id'
]
const minFields02 = [
  'id',
  'cityCode',
  'cityName',
]
const minFields03 = [
  'cityCode',
  'cityName',
  'areaId'
]
const mainFields = [
  'cityCode', 'cityName', 'areaId',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const mainViewFields = mainFields

export async function srvGetCities (query, filter = false) {
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

export async function srvGetCityByCode (cityCode, query = {}) {
  let { pageSize, page, order, q, ...other } = query
  let attributes = minFields02
  let where = { cityCode }
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

export async function srvGetCityById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: false
  })
}

export function srvCityExist (cityCode) {
  return srvGetCityByCode(cityCode).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateCity (data, createdBy, next) {
  return table.create({
    cityCode: data.cityCode,
    cityName: data.cityName,
    areaId: data.areaId,
    createdAt: moment(),
    createdBy: createdBy
  }).catch(err => {
    console.log(err)
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSMC-00001'
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateCity (data, updatedBy, next) {
  return table.update({
    cityName: data.cityName,
    areaId: data.areaId,
    updatedBy: updatedBy,
    updatedAt: moment()
  }, {
    where: {
      cityCode: data.code
    }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSMC-00002'
    next(new ApiError(400, other, err))
  })
}

export function srvDeleteCity (cityCode, next) {
  return table.destroy({
    where: { cityCode }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSMC-00003'
    next(new ApiError(400, err, err))
  })
}