import { ApiError} from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
import sequelize from '../../native/sequelize'
import native from '../../native/master/sqlAssetSpesification'
import {getNativeQuery, getSelectAddition} from '../../native/nativeUtils'

const stringSQL = {
  s00001: native.sqlCarBrands,
  s00002: native.sqlCarModels,
  s00003: native.sqlCarTypes,
  s00004: native.sqlCarBrand,
  s00005: native.sqlCarModel,
  s00006: native.sqlCarType
}

export function srvCarBrands (query) {
  const select = getSelectAddition(query)
  const sSQL = stringSQL.s00001
    .replace("_ORDER01", select.order)
    .replace("_LIMIT01", select.limit)
  return getNativeQuery(sSQL, false)
}
export function srvCarModels (brandId, query) {
  const select = getSelectAddition(query)
  const sSQL = stringSQL.s00002
    .replace("_BIND01", brandId)
    .replace("_ORDER01", select.order)
    .replace("_LIMIT01", select.limit)
  return getNativeQuery(sSQL, false)
}
export function srvCarTypes (modelId,query) {
  const select = getSelectAddition(query)
  const sSQL = stringSQL.s00003
    .replace("_BIND01", modelId)
    .replace("_ORDER01", select.order)
    .replace("_LIMIT01", select.limit)
  return getNativeQuery(sSQL, false)
}
export function srvCarBrand (brandId, query) {
  const whereCondition = 'id = ' + brandId
  const select = getSelectAddition(query)
  const sSQL = stringSQL.s00004
    .replace("_BIND01", whereCondition)
    .replace("_ORDER01", select.order)
    .replace("_LIMIT01", select.limit)
  return getNativeQuery(sSQL, true)
}
export function srvCarModel (modelId, query) {
  const whereCondition = 'id = ' + modelId
  const select = getSelectAddition(query)
  const sSQL = stringSQL.s00005
    .replace("_BIND01", whereCondition)
    .replace("_ORDER01", select.order)
    .replace("_LIMIT01", select.limit)
  return getNativeQuery(sSQL, true)
}
export function srvCarType (typeId, query) {
  const whereCondition = 'id = ' + typeId
  const select = getSelectAddition(query)
  const sSQL = stringSQL.s00006
    .replace("_BIND01", whereCondition)
    .replace("_ORDER01", select.order)
    .replace("_LIMIT01", select.limit)
  return getNativeQuery(sSQL, true)
}
