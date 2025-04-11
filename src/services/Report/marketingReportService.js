import db from '../../models'
import sequelize from '../../native/sequelize'
import { getNativeQuery } from '../../native/nativeUtils'

export const getGroupByParams = (params) => (Number(params) ? 'categoryId' : 'brandId')

const queryHpp = (storeId, year, period) => `
  call sp_nilai_persediaan_fifo(${period},${year},${storeId})
`

const dummyBeginBalance = `
  DROP TEMPORARY TABLE IF EXISTS temp_beginning_balance;
  CREATE TEMPORARY TABLE temp_beginning_balance AS
    SELECT
      0 as productId,
      0 as qty,
      0 as purchasePrice;
`

const queryBegin = (storeId, year, byCategory) => `
  select
    vw_qty_in.productId,
    tbl_stock.categoryId,
    tbl_stock.brandId,
    sum(vw_qty_in.qty * vw_qty_in.purchasePrice) as qtyBegin
  from vw_qty_in
  inner join tbl_stock on vw_qty_in.productId = tbl_stock.id
  where transType = 'awal'
        and storeId = ${storeId}
  and month(transDate) = 1
  and year(transDate) = ${year}
  group by tbl_stock.${getGroupByParams(byCategory)}
  # group by tbl_stock.id
`

const queryIn = (storeId, year, period, byCategory) => `
  select
    vw_qty_in.productId,
    tbl_stock.categoryId,
    tbl_stock.brandId,
    sum(vw_qty_in.qty * vw_qty_in.purchasePrice) as qtyIn
  from vw_qty_in
  inner join tbl_stock on vw_qty_in.productId = tbl_stock.id
  where transType != 'awal'
      and storeId = ${storeId}
  and date(transDate) between '${year}-01-01' and last_day(date(concat_ws('-', ${year}, ${period}, 1)))
  group by tbl_stock.${getGroupByParams(byCategory)}
  #group by tbl_stock.id
`

const queryTempBegin = (byCategory) => `
  select
    a.productId,
    b.categoryId,
    b.brandId,
    sum(a.qty * a.purchasePrice) as tempBeginQty
  from temp_beginning_balance a
  inner join tbl_stock b ON a.productId = b.id
  group by b.${getGroupByParams(byCategory)};
`

const queryTblBegin = (storeId, year, period, byCategory) => `
  select
    a.productId,
    b.categoryId,
    b.brandId,
    sum(a.qty * a.purchasePrice) as tempBeginQty
  from vw_qty_in a
  inner join tbl_stock b ON a.productId = b.id
  WHERE a.storeId = ${storeId} AND
    transType = 'awal' AND
    month(transDate) = ${period} AND
    year(transDate) = ${year}
  group by b.${getGroupByParams(byCategory)}
  #group by b.id
`

const querySales = (storeId, year, to, byCategory) => `
WITH custom AS (
  select
    MONTH(a.transDate) as period,
    YEAR(a.transDate)  as year,
    a.id,
    a.storeId,
    a.serviceType,
    a.brandId,
    a.categoryId,
    a.categoryName,
    count(policeNoId)  as unitEntry,
    sum(a.qty)         as qty,
    sum(a.DPP + a.PPn) as netto,
    a.status,
    a.typeCode
  from vw_sales_product_inc_spec a
  where a.storeId = ${storeId}
        AND year(a.transDate) = ${year}
  group by a.${getGroupByParams(byCategory)}, year(a.transDate), MONTH(a.transDate)
  order by a.${getGroupByParams(byCategory)}, a.transNo, a.transDate
), cte AS (
  select
  a.period,
  a.year,
  a.storeId,
  a.brandId,
  a.categoryId,
  a.categoryName,
  SUM(a.unitEntry)     as unitEntry,
  SUM(a.qty)           as qty,
  SUM(a.netto)         as netto,
  SUM(a.qty) OVER
  (PARTITION BY year, ${getGroupByParams(byCategory)}
  order by a.id)
                       as currentTotalQty,
  SUM(a.netto) OVER
  (PARTITION BY year, ${getGroupByParams(byCategory)}
  order by a.id)
                       as currentTotalPrice,
  SUM(a.unitEntry) OVER
  (PARTITION BY year, ${getGroupByParams(byCategory)}
  order by a.id)       as currentTotalUnitEntry
from custom a
GROUP BY period, year, ${getGroupByParams(byCategory)}
ORDER BY ${getGroupByParams(byCategory)}, period, year
) select * from cte
#where cte.period <= ${to}
`

let tableCategory = db.tbl_stock_category
let tableBrand = db.tbl_stock_brand
const Fields = [
  'id',
  'categoryCode',
  'categoryName'
]

const FieldsBrand = [
  'id',
  ['brandCode', 'categoryCode'],
  ['brandName', 'categoryName'],
]

export function countData (query) {
  const { type, field, order, q, storeId, from, to, year, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { between: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { $iRegexp: other[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return tableCategory.count({
      where: {
        $or: querying,
        ...other
      },
    })
  } else {
    return tableCategory.count({
      where: {
        ...other
      }
    })
  }
}

export function countDataBrand (query) {
  const { type, field, order, q, storeId, from, to, year, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { between: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { $iRegexp: other[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return tableBrand.count({
      where: {
        $or: querying,
        ...other
      },
    })
  } else {
    return tableBrand.count({
      where: {
        ...other
      }
    })
  }
}

export function getData (query, pagination) {
  const { type, field, order, q, storeId, from, to, year, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { between: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { $iRegexp: other[key] }
    }
  }
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return tableCategory.findAll({
      attributes: Fields,
      where: {
        $or: querying,
        ...other
      },
      raw: false,
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return tableCategory.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        ...other
      },
      raw: false,
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function getDataBrand (query, pagination) {
  const { type, field, order, q, storeId, from, to, year, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { between: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { $iRegexp: other[key] }
    }
  }
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return tableBrand.findAll({
      attributes: FieldsBrand,
      where: {
        $or: querying,
        ...other
      },
      raw: false,
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return tableBrand.findAll({
      attributes: query.field ? query.field.split(',') : FieldsBrand,
      where: {
        ...other
      },
      raw: false,
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export async function getReportSalesRunningTotal (storeId, year, to, byCategory) {
  const data = await getNativeQuery(querySales(storeId, year, to, byCategory), false, 'SELECT')
  return data
}

export async function getReportSalesCostTotal (storeId, year, period) {
  const data = await getNativeQuery(queryHpp(storeId, year, period), false, 'RAW')
  return data
}

export async function getReportBeginBalanceTotal (byCategory) {
  const data = await getNativeQuery(queryTempBegin(byCategory), false, 'SELECT')
  return data
}

export async function getReportRealBeginBalanceTotal (storeId, year, period, byCategory) {
  const data = await getNativeQuery(queryTblBegin(storeId, year, period, byCategory), false, 'SELECT')
  return data
}

export async function getReportBeginTotal (storeId, year, byCategory) {
  const data = await getNativeQuery(queryBegin(storeId, year, byCategory), false, 'SELECT')
  return data
}

export async function getReportVwQtyIn (storeId, year, period, byCategory) {
  const data = await getNativeQuery(queryIn(storeId, year, period, byCategory), false, 'SELECT')
  return data
}

export async function createDummyBeginBalanceTotal () {
  const data = await getNativeQuery(dummyBeginBalance, false, 'RAW')
  return data
}
