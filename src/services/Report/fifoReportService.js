/**
 * Created by Veirry on 25/10/2018.
 */
import nativeStock from '../../native/product/sqlStockBalance'
import { getNativeQuery } from '../../native/nativeUtils'
import { getOnePeriodActive } from '../periodeService'
import moment from 'moment'


export function getCurrentStockBalance (data, next) {
  let sSQL
  sSQL = nativeStock.sqlGetCurrentStock
    .replace("_BIND01", data.start)
    .replace("_BIND02", data.end)
    .replace("_BIND03", data.storeId)
    .replace("_BIND04", data.product)
  return getNativeQuery(sSQL, false, 'RAW', next)
}


export function checkStockMinus (data, type, next) {
  const { storeid, transno, product } = data
  const pack = {
    trans_code: type,
    trans_no: transno,
    store_id: storeid,
    trans_detail: product
  }
  const ssql = `select * from fn_stock_qty_cek('${JSON.stringify(pack)}'::json)`
  return getNativeQuery(ssql, false, 'RAW', next).then(dt => {
    return dt[0][0].fn_stock_qty_cek
  })
}


export async function getStockMinusAlert (header, data, next) {
  let statusData = {
    status: false,
    data: []
  }

  if ((data || []).length === 0) {
    return statusData
  }
  
  const dataOnePeriodActive = await getOnePeriodActive(header.storeId)

  if (!JSON.parse(JSON.stringify(dataOnePeriodActive))) {
    statusData = {
      status: true,
      data: []
    }
    
    return statusData
  }
  // 1. Get Cancel Stock
  // 2. Get Stock By Period
  // 3. Get CurrentStock
  // Calculate Useable Stock (1)
  // Calculate Useable Stock (2)

  // const getStockByPeriod = await getInDetail({ transNo: data.transNo, storeId: data.storeId })
  const cancelStockProductIdString = data.map(x => x.productId).toString()
  
  const formatStart = moment(dataOnePeriodActive.startPeriod).format('YYYY-MM-DD')
  const formatEnd = moment(header.transDate).format('YYYY-MM-DD')
  const getCurrentStock = await getCurrentStockBalance({ start: formatStart, end: formatEnd, storeId: header.storeId, product: cancelStockProductIdString }, next)
  const getCurrentStockMap = getCurrentStock[0].map(x => {
    const data = {
      productId: x.productId,
      count: x.count,
    }
    return data
  })
  for (let i = 0; i < (data || []).length; i += 1) {
    const currentDataStock = getCurrentStockMap.filter(x => x.productId === data[i].productId)
    let currentStockQty = ((currentDataStock[0] || {}).count || 0)
    if (currentStockQty - data[i].qty < 0) {
      let restrictedStock = true
      data[i].count = currentStockQty - data[i].qty
      let restrictedStockData = []
      restrictedStockData.push(data[i])
      statusData = {
        status: restrictedStock,
        data: restrictedStockData
      }
    }
  }
  
  return statusData
}
