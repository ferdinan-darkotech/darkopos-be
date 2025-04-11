import dbv from '../../../../models/viewR'
import { setDefaultQuery } from '../../../../utils/setQuery'
import { getNativeQuery } from '../../../../native/nativeUtils'
import moment from 'moment'

const vwInsRoles = dbv.vw_insentive_roles
const attributeRoles = [
  'rolescode','storename','storecode', 'positioncode','positionname', 'categorycode',
  'categoryname','brandcode', 'brandname', 'instypecode', 'instypename', 'insvalue',
  'createdby', 'createdat', 'updatedby', 'updatedat'
]

// global function
export function srvGetInsentiveRoles (query) {
  const { m, store, ...other } = query
  let queryDefault = setDefaultQuery(attributeRoles, other, true)
  queryDefault.where = { ...queryDefault.where, storeid: store }
  return vwInsRoles.findAndCountAll({
    attributes: attributeRoles,
    ...queryDefault,
    raw: true
  })
}

export function srvModifyInsentiveRoles (data, userid) {
  const tmpData = {
    rolescode: data.rolescode,
    categorycode: data.categorycode,
    brandcode: data.brandcode,
    instype: data.instype,
    insvalue: parseFloat(data.insvalue),
    positioncode: data.positioncode
  }
  const modifyInsentiveRoles = `select value from sch_pos.fn_modify_insentive_roles('${userid}', '${JSON.stringify(tmpData)}') value`
  return getNativeQuery(modifyInsentiveRoles, true, 'CALL')
}
