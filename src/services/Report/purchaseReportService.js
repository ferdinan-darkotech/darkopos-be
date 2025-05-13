/**
 * Created by Veirry on 15/09/2017.
 */
import dbv from '../../models/view'
import dbvr from '../../models/viewR'
import sequelize from '../../native/sequelize'
import { getNativeQuery } from '../../native/nativeUtils'
import moment from 'moment'
import stringSQL from '../../native/sqlPurchaseReport'
import { Op } from 'sequelize'

const vw_report_purchase_trans = dbv.vw_report_purchase_trans
const vwInTransit = dbvr.vw_report_in_transit

const reportTrans = [
  'transDate', 'transNo', 'taxType', 'supplierName', 'qty', 'total', 'discount', 'dpp',
  'ppn', 'netto', 'rounding', 'reference'
]
const InTransit = [
  'storecode', 'storename', 'transno', 'transdate', 'receivedate', 'duedate', 'productcode', 'productname', 'tax',
  'qty', 'price', 'discp1', 'discp2', 'discp3', 'discp4', 'discp5', 'discnominal', 'discitem', 'rounding_dpp',
  'rounding_ppn', 'rounding_netto', 'dpp', 'ppn', 'netto'
]

export function getReportPurchaseTrans (query) {
  if (query.from) {
    return vw_report_purchase_trans.findAll({
      attributes: reportTrans,
      where: {
        transDate: {
          [Op.between]: [query.from, query.to]
        },
        storeId: query.storeId
      },
      order: [['transdate', 'asc'], ['transno','asc']]
    })
  } else {
    return vw_report_purchase_trans.findAll({
      attributes: reportTrans,
      where: {
        storeId: query.storeId
      },
      order: [['transdate', 'asc'], ['transno','asc']]
    })
  }
}


export function getDailyPurchase (query) {
  let sSQL
  switch (query.mode) {
    case 'p': sSQL = stringSQL.s00001; break         //product
    case 'b': sSQL = stringSQL.s00002; break         //brand
    case 'c': sSQL = stringSQL.s00003; break         //category
    case 'pbc': sSQL = stringSQL.s00004; break       //product-brand-category
    default: sSQL = stringSQL.s00001; break          //product
  }

  sSQL = sSQL.replace("_BIND01", query.from).replace("_BIND02", query.to)
  if (query.category && query.brand) {
    sSQL = sSQL.replace("_WHERECONDITION",
      query.category ? " AND a.categoryName='" + query.category + "'" +
        " AND a.brandName='" + query.brand + "'" +
        " AND a.storeId='" + query.storeId + "'" : "")
  } else {
    if (query.category) {
      sSQL = sSQL.replace("_WHERECONDITION",
        query.category ? " AND a.categoryName='" + query.category + "'" +
          " AND a.storeId='" + query.storeId + "'" : "")
    }
    if (query.brand) {
      sSQL = sSQL.replace("_WHERECONDITION",
        query.brand ? " AND a.brandName='" + query.brand + "'" +
          " AND a.storeId='" + query.storeId + "'" : "")
    }
    if (!(query.brand && query.category)) {
      sSQL = sSQL.replace("_WHERECONDITION",
        query.storeId ? "AND a.storeId='" + query.storeId + "'" : "")
    }
  }
  console.log('sSQL', sSQL)

  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, { type: sequelize.QueryTypes.SELECT })
      .then(users => {
        resolve(users)
      })
  })
}

export function srvGetReportTransit (type, userid, query) {
  const { transdate, list_store } = query

  let sSql = ''
  if(type === 'period') {
    const perPeriod = moment(transdate).format('YYYY-MM') 
    sSql = `select * from sch_pos.fn_in_transit_per_period('${userid}', '${list_store}', '${perPeriod}') val`
  } else if (type === 'date') {
    const perDate = moment(transdate).format('YYYY-MM-DD') 
    sSql = `select * from sch_pos.fn_in_transit_per_date('${userid}', '${list_store}', '${perDate}') val`
  } else {
    throw 'Type is not defined.'
  }

  return getNativeQuery(sSql,false, 'RAW').then(result => {
    return { success: true, data: result[0] }
  }).catch(er => {
    return { success: false, message: er.message }
  })
}
