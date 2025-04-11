import dbv from '../../../models/viewR'
import { getNativeQuery } from '../../../native/nativeUtils'
import moment from 'moment'


export async function srvCustomerServicesTrans (query, userid) {
  let { periode } = query 

  const perUnitType = `select * from sch_pos.fn_report_sum_customer_visit('${periode}', '${userid}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export async function srvCustomerServiceTransByTypes (query, userid) {
  let { periode } = query 

  const perUnitType = `select * from sch_pos.fn_report_sum_service_customer_types('${periode}', '${userid}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export async function srvCustomerServiceTransByGroups (query, userid) {
  let { periode } = query 

  const perUnitType = `select * from sch_pos.fn_report_sum_service_customer_groups('${periode}', '${userid}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export async function srvFrequenceCustomerServices (query, userid) {
  let { periode, freqmin = 1, freqmax = 2 } = query 

  const perUnitType = `select * from sch_pos.fn_report_sum_service_frequence('${periode}', ${freqmin}, ${freqmax}, '${userid}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export async function srvCustomerServiceAndProduct (query, userid) {
  let { periode } = query 

  const perUnitType = `select * from sch_pos.fn_report_sum_services_product_details('${periode}', '${userid}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export async function srvCustomerServiceByUnit (query, userid) {
  let { periode } = query 

  const perUnitType = `select * from sch_pos.fn_report_sum_cust_unit_services('${periode}', '${userid}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export async function srvCustomerTransByPackageBundling (query, userid) {
  let { periode } = query 

  const perUnitType = `select * from sch_pos.fn_report_sum_sales_by_packages_bundling('${periode}', '${userid}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export async function srvCustomersVerified (query, userid) {
  let { periode } = query 

  const perUnitType = `select * from sch_pos.fn_report_sum_verified_customer('${periode}', '${userid}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export async function srvSumCustomerCoupon (query, userid) {
  let { periode } = query 

  const perUnitType = `select * from sch_pos.fn_customer_coupon_summary('${periode}', '${userid}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export async function srvSumLastVisitCustomer (query, userid) {
  let { periode, range = [] } = query 

  const perUnitType = `select * from sch_pos.fn_sum_last_visit_customer('${periode}', '${userid}', '${JSON.stringify(range)}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}