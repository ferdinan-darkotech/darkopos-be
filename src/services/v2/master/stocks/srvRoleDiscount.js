import db from '../../../../models/tableR'
import dbv from '../../../../models/viewR'
import { getNativeQuery } from '../../../../native/nativeUtils'
import { setDefaultQuery } from '../../../../utils/setQuery'

const Op = require('sequelize').Op
const rolesDiscount = dbv.vw_roles_discount
const logRolesDiscount = db.tbl_role_discount_log

const attrRolesDiscount = [
  'id', 'categorycode', 'categoryid', 'categoryname', 'brandid', 'brandcode', 'brandname', 'productid', 'productcode',
  'productname', 'max_disc_percent', 'max_disc_nominal', 'membergroupcode', 'membergroupname', 'status'
]

const attrLogRolesDiscount = [
  'max_disc_percent', 'max_disc_nominal', 'createdby', 'createdat', 'status'
]

export function srvGetLogRolesDiscount (store, query) {
  // const { brand, category, product } = query
  return logRolesDiscount.findAll({
    attributes: attrLogRolesDiscount,
    where: {
      discountid: query.discountid
    },
    order: [['createdat', 'DESC']],
    raw: true
  })
}


export function srvGetRolesDiscount (query) {
  const { m, storeid, ...other } = query
  let queryDefault = setDefaultQuery(attrRolesDiscount, { ...other }, true)
  queryDefault.where = { ...queryDefault.where, storeid }
  return rolesDiscount.findAndCountAll({
    attributes: attrRolesDiscount,
    ...queryDefault,
    raw: true
  })
}

export function srvModifierRolesDiscount (data, userid) {
  const { store, payload = {} } = data
  const { listProduct = [], actionType, ...items = {} } = payload
  const sSql = `select * from sch_pos.fn_modify_role_discount('${actionType}', '${store}', '${userid}', '${JSON.stringify(items)}', '${JSON.stringify(listProduct || [])}') val`
  return getNativeQuery(sSql,true, 'RAW').then(result => {
    return { success: true, data: result[0][0].val, message: 'Data has been saved' }
  }).catch(er => {
    return { success: false, message: er.message }
  })
}

export function srvModifierRolesDiscountByImport (data, userid) {
  const { store, payload } = data
  const { listProduct = [] } = payload
  const sSql = `select * from sch_pos.fn_modify_role_discount_by_import('${JSON.stringify(listProduct)}', '${store}', '${userid}') val`
  return getNativeQuery(sSql,true, 'RAW').then(result => {
    return { success: true, data: result[0][0].val, message: 'Data has been saved' }
  }).catch(er => {
    return { success: false, message: er.message }
  })
}