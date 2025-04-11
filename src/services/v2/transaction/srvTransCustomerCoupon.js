import dbv from '../../../models/viewR'
import db from '../../../models/tableR'
import moment from 'moment'
import sequelize from '../../../native/sequelize'
import { getNativeQuery } from '../../../native/nativeUtils'
import { setDefaultQuery } from '../../../utils/setQuery'

const tbCustCoupon = db.tbl_customer_coupon
const tbCustCouponClaim = db.tbl_customer_coupon_claim

const vwCustCoupon = dbv.vw_customer_coupon
const vwCustCouponClaim = dbv.vw_customer_coupon_claim
const vwCustCouponSalesTrans = dbv.vw_customer_coupon_sales_trans

// report schema
const vwReportPointReceive = dbv.vw_report_customer_point_receive
const vwReportPointUsed = dbv.vw_report_customer_point_used

const attrCouponSalesTrans = [
  'coupon_id', 'store_id', 'store_code', 'store_name', 'sales_id', 'sales_no',
  'sales_date', 'point_receive'
]
const attrCouponClaim = [
  'coupon_id', 'store_id', 'store_code', 'store_name', 'sales_id', 'sales_no',
  'sales_date', 'used_point', 'cust_point', 'created_by', 'created_at',
  'updated_by', 'updated_at'
]

const attrReportCustomerPointReceive = [
  'coupon_code', 'store_code', 'store_name', 'sales_no', 'sales_date', 'point_receive',
  'member_code', 'member_name', 'member_type_code', 'member_type_name', 'policeno',
  'unit_type', 'chassis_no', 'unit_merk', 'unit_model', 'unit_year'
]

const attrReportCustomerPointUsed = [
  'coupon_code', 'store_code', 'store_name', 'sales_no', 'sales_date', 'used_point',
  'cust_point', 'member_code', 'member_name', 'member_type_code', 'member_type_name',
  'policeno', 'unit_type', 'chassis_no', 'unit_merk', 'unit_model', 'unit_year'
]

const attrCustCoupon = {
  mf: [
    'id', 'coupon_code', 'ho_id', 'ho_code', 'ho_name', 'member_id', 'member_code', 'member_name', 'member_type_id',
    'member_type_code', 'member_type_name', 'policeno_id', 'policeno', 'unit_type', 'chassis_no',
    'unit_merk', 'unit_model', 'unit_year', 'point_earned', 'point_used', 'created_by', 'created_at', 'updated_by',
    'updated_at'
  ],
  bf: [
    'coupon_code', 'ho_code', 'ho_name', 'member_code', 'member_name', 'member_type_code', 'member_type_name',
    'policeno', 'unit_type', 'chassis_no', 'unit_merk', 'unit_model', 'unit_year', 'point_earned', 'point_used',
    'created_by', 'created_at', 'updated_by', 'updated_at'
  ],
  sf: [
    'coupon_code', 'ho_code', 'ho_name', 'member_code', 'member_name', 'member_type_code', 'member_type_name',
    'policeno', 'unit_type', 'chassis_no', 'unit_merk', 'unit_model', 'unit_year', 'point_earned', 'point_used'
  ]
}

export function srvGetAllCouponByVerifyWA (waNo) {
  return vwCustCoupon.findAll({
    attributes: ['coupon_code', 'member_name', 'member_code', 'policeno', 'point_earned', 'point_used'],
    where: { verification_wa_id: waNo },
    raw: true
  })
}

// Report Service
export function srvGetReportCustomerPointReceived (ho_id, query) {
  const { fromDate, toDate, member = [], policeno = [], orderBy = {}, store } = query
  const otherWhere = {
    ...(member.length !== 0 && typeof member === 'object' ? { member_code: { $in: member } } : {}),
    ...(policeno.length !== 0 && typeof policeno === 'object' ? { policeno: { $in: policeno } } : {}),
    ...(store.length !== 0 && typeof store === 'object' ? { store_code: { $in: store } } : {})
  }
  const tmpOrderBy = Object.getOwnPropertyNames(orderBy)
  const mapOrder = tmpOrderBy.map(x => [x, orderBy[x]])
  return vwReportPointReceive.findAll({
    attributes: attrReportCustomerPointReceive,
    where: {
      ho_id,
      sales_date: { $between: [fromDate, toDate] },
      cancel_trans: { $eq: false },
      ...otherWhere
    },
    order: mapOrder,
    raw: true
  })
}

export function srvGetReportCustomerPointUsed (ho_id, query) {
  const { fromDate, toDate, member = [], policeno = [], store, orderBy = {} } = query
  const otherWhere = {
    ...(member.length !== 0 && typeof member === 'object' ? { member_code: { $in: member } } : {}),
    ...(policeno.length !== 0 && typeof policeno === 'object' ? { policeno: { $in: policeno } } : {}),
    ...(store.length !== 0 && typeof store === 'object' ? { store_code: { $in: store } } : {})
  }
  const tmpOrderBy = Object.getOwnPropertyNames(orderBy)
  const mapOrder = tmpOrderBy.map(x => [x, orderBy[x]])
  return vwReportPointUsed.findAll({
    attributes: attrReportCustomerPointUsed,
    where: {
      ho_id,
      sales_date: { $between: [fromDate, toDate] },
      cancel_trans: { $eq: false },
      ...otherWhere
    },
    order: mapOrder,
    raw: true
  })
}
// Report Service


export function srvGetSomeCustomerCoupon (query) {
  const { ho_id, m, ...other } = query
  const tmpAttributes = (attrCustCoupon[(m || 'sf')] || [])
  let queryDefault = setDefaultQuery(tmpAttributes, { ...other }, true)
  queryDefault.where = { ...queryDefault.where, ho_id }
  return vwCustCoupon.findAndCountAll({
    attributes: tmpAttributes,
    ...queryDefault,
    raw: true
  })
}

export function srvGetCustomerCouponByMemberCode (ho_id, member_code, m) {
  const tmpAttributes = (attrCustCoupon[(m || 'sf')] || [])
  return vwCustCoupon.findAll({
    attributes: tmpAttributes,
    where: { member_code, ho_id },
    raw: true
  })
}

export function srvGetHistorySalesIncludeCoupon (coupon_id, activeOnly = false) {
  return vwCustCouponSalesTrans.findAll({
    attributes: attrCouponSalesTrans,
    where: { coupon_id, ...(activeOnly ? { cancel_trans: { $eq: false } } : {}) },
    raw: true
  })
}

export function srvGetHistoryCouponClaim (coupon_id, activeOnly = false) {
  return vwCustCouponClaim.findAll({
    attributes: attrCouponClaim,
    where: { coupon_id, ...(activeOnly ? { cancel_trans: { $eq: false } } : {}) },
    raw: true
  })
}

export function srvGetCustomerCouponByMemberAndPlat (ho_id, member_code, policeno, m) {
  const tmpAttributes = (attrCustCoupon[(m || 'sf')] || [])
  return vwCustCoupon.findOne({
    attributes: tmpAttributes,
    where: { member_code, policeno, ho_id },
    raw: true
  })
}

export function srvCreateCustomerCoupon (cust_coupon_id, data) {
  if(!data.store_id) throw 'Store is required.'
  if(!!cust_coupon_id) {
    return tbCustCoupon.update({
      curr_coupon_code: 'RESET-COUPON-CODE',
      ho_id: data.ho_id,
      store_id: data.store_id,
      point_earned: 0,
      updated_by: data.user,
      updated_at: moment()
    }, { where: { id: cust_coupon_id } }).then(rs => ({ success: true, data: rs }))
    .catch(rs => ({ success: false, message: rs.message }))
  } else {
    return tbCustCoupon.create({
      curr_coupon_code: 'RESET-COUPON-CODE',
      ho_id: data.ho_id,
      store_id: data.store_id,
      member_id: data.member_id,
      policeno_id: data.policeno_id,
      created_by: data.user,
      created_at: moment()
    }).then(rs => ({ success: true, data: rs }))
    .catch(rs => ({ success: false, message: rs.message }))
  }
}


export function srvCreatePointHistory ({
  store, member, policeno, userName, details
}, transaction) {
  const sSql = `select * from sch_pos.fn_insert_point_coupon_sales(${store}, ${member}, ${policeno}, '${userName}', '${JSON.stringify(details)}')`
  return getNativeQuery(sSql, false, 'RAW', null, transaction).then(result => {
    return { success: true, data: result[0][0].val }
  }).catch(er => {
    return { success: false, message: er.message }
  })
}

export function srvCreateCouponClaim ({
  store, member, policeno, userName, details
}, transaction) {
  const sSql = `select * from sch_pos.fn_insert_coupon_claim(${store}, ${member}, ${policeno}, '${userName}', '${JSON.stringify(details)}')`
  return getNativeQuery(sSql, false, 'RAW', null, transaction).then(result => {
    return { success: true, data: result[0][0].val }
  }).catch(er => {
    return { success: false, message: er.message }
  })
}

export function srvInsertManualCustomerPoint ({ pass_code, data_source }) {
  const newData = data_source.map(x => ({ member: x.member, transno: x.transno, point: x.point }))
  const sSql = `select * from sch_pos.fn_insert_manual_customer_point('${pass_code}', '${JSON.stringify(newData)}')`
  return getNativeQuery(sSql, false, 'RAW', null).then(result => {
    return { success: true, data: result[0] }
  }).catch(er => {
    return { success: false, message: er.message }
  })
}