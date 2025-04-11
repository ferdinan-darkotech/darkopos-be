import dbv from '../../../models/viewR'
import { getNativeQuery } from '../../../native/nativeUtils'
import moment from 'moment'

const fullAttributeSaleReport = [ 'storeCode', 'storeId', 'transNo', 'transDate',
'paymentOptionCode', 'paymentTypeName', 'providerName', 'cardNo', 'cardInfo', 'edcName', 'netto' ]

const fullAttributeSaleMcn = [ 'storeCode', 'storeName', 'productCode', 'productName', 'transNo', 'woId', 'woReference',
'transDate', 'policeNoId', 'bundlingId', 'employeeCode', 'employeeName', 'qty', 'sellPrice', 'sellingPrice',
'discount', 'disc1', 'disc2', 'disc3', 'DPP', 'PPN', 'typeCode' ]

const saleReport = dbv.vwi_sale_payment
const salesPerMechanic = dbv.vw_sales_mechanic

export async function srvGetSaleReport (query) {
  return saleReport.findAll({
    attributes: fullAttributeSaleReport,
    where: {
      paymentOptionCode: query.paymentOptionCode,
      storeCode: query.storeCode,
      transDate: { '$between': query.transDate} 
    },
    order: [
      ['storeCode', 'ASC'],
      ['transDate', 'ASC']
    ],
    raw: false
  })
}

export async function srvGetSalesReportPerMechanic (query) {
  let employeeFilter = {}
  if(query.employee) {
    employeeFilter = query.employee !== 'getAllEmployee' ? {employeeCode: { $in: (query.employee || '').split(',') }} : {}
  }
  return salesPerMechanic.findAll({
    attributes: fullAttributeSaleMcn,
    where: {
      storeCode: { $in: (query.store || '').split(',') },
      transDate: { $between: query.transDate },
      ...employeeFilter
    },
    order: [
      ['storeCode', 'ASC'],
      ['employeeCode', 'ASC'],
      ['transDate', 'ASC']
    ],
    raw: false
  }).then(record => JSON.parse(JSON.stringify(record)).map(item => ({ ...item, transDate: moment(item.transDate).format('DD-MM-YYYY') })))
}


export function srvGetReportSSR (query, userid) {
  let { store, from, to } = query 
  
  const mainSSR = `select * from sch_pos.fn_report_ssr('${store || -1}', '${userid}', '${from}', '${to}')`
  const otherSSR = `select * from sch_pos.fn_report_ssr_other('${store || -1}', '${userid}', '${from}', '${to}')`
  return Promise.all([getNativeQuery(mainSSR, false, 'CALL'), getNativeQuery(otherSSR, false, 'CALL')])
}

export function srvGetInsentiveReport (query, userid) {
  let { store, pdate } = query 
  
  const newPeriode = pdate ? moment(pdate).format('YYYY-MM-01') : null
  const insentiveQuery = `select * from sch_pos.fn_insentive_employee(${store}, '${newPeriode}') value`
  return getNativeQuery(insentiveQuery, false, 'CALL')
}

export function srvGetStockMovements (query, userid) {
  let { store, fromdate, todate } = query 
  
  const insentiveQuery = `select * from sch_pos.fn_report_movement_stocks('${store}', '${userid}', '${fromdate}', '${todate}') value`
  return getNativeQuery(insentiveQuery, false, 'CALL')
}

export function srvGetFocusProducts (query, userid) {
  let { store, fromdate, todate, category } = query 
  
  const newFromDate = moment(fromdate).format('YYYY-MM-01')
  const newToDate = moment(todate).endOf('month').format('YYYY-MM-DD')
  const insentiveQuery = `select * from sch_pos.fn_report_focus_product('${store}', '${category}', '${userid}', '${newFromDate}', '${newToDate}') value`
  return getNativeQuery(insentiveQuery, false, 'CALL')
}

export function srvSalesReportByTireSize (query, userid) {
  let { store, fromdate, todate } = query 
  
  const newFromDate = moment(fromdate).format('YYYY-MM-01')
  const newToDate = moment(todate).endOf('month').format('YYYY-MM-DD')
  const insentiveQuery = `select * from sch_pos.report_sales_by_tire_size('${store}', '${newFromDate}', '${newToDate}', '${userid}') value`
  return getNativeQuery(insentiveQuery, false, 'CALL')
}

export function srvLastHistoryMemberSales (query, userid) {
  let { store, fromdate, todate, inmonth } = query 
  
  const newFromDate = moment(fromdate).format('YYYY-MM-01')
  const newToDate = moment(todate).endOf('month').format('YYYY-MM-DD')
  const newInMonth = +inmonth

  const historyMember = `select * from sch_pos.fn_last_history_sales_member(${newInMonth}, '${newFromDate}', '${newToDate}', '${store}') value`
  return getNativeQuery(historyMember, false, 'CALL')
}


export function srvSalesPerUnitType (query, userid) {
  let { store, fromdate, todate } = query 
  
  const newFromDate = moment(fromdate).format('YYYY-MM-DD')
  const newToDate = moment(todate).format('YYYY-MM-DD')

  const perUnitType = `select * from sch_pos.fn_report_sales_per_unit_type('${userid}', '${store}', '${newFromDate}', '${newToDate}') value`
  return getNativeQuery(perUnitType, false, 'CALL')
}

export function srvSalesPerUnitBrand (query, userid) {
  let { store, fromdate, todate } = query 
  
  const newFromDate = moment(fromdate).format('YYYY-MM-DD')
  const newToDate = moment(todate).format('YYYY-MM-DD')

  const perUnitBrand = `select * from sch_pos.fn_report_sales_per_unit_brand('${userid}', '${store}', '${newFromDate}', '${newToDate}') value`
  return getNativeQuery(perUnitBrand, false, 'CALL')
}

export function srvGetLastTransVerifiedMember (userName, query) {
  let {
    ftype,
    stores,
    fdate,
    fcutat,
    productCategories,
    productBrands,
    unitBrands,
    unitCategories,
    unitModels,
    unitTypes
  } = query 
  
  const dataProps = {
    type: ftype,
    date: fdate ? moment(fdate).format('YYYY-MM-DD') : null,
    cutat: fcutat ? moment(fcutat).format('YYYY-MM-DD') : null,
    productCategories: typeof productCategories === 'string' ? productCategories : '',
    productBrands: typeof productBrands === 'string' ? productBrands : '',
    unitBrands: typeof unitBrands === 'string' ? unitBrands : '',
    unitCategories: typeof unitCategories === 'string' ? unitCategories : '',
    unitModels: typeof unitModels === 'string' ? unitModels : '',
    unitTypes: typeof unitTypes === 'string' ? unitTypes : ''
  }

  const lastTransMember = `select * from sch_pos.last_trans_customers('${userName}', '${JSON.stringify(dataProps)}'::jsonb) value`
  return getNativeQuery(lastTransMember, false, 'CALL')
}