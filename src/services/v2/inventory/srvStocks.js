import dbv from '../../../models/view'
import dbvr from '../../../models/viewR'
import db from '../../../models'
import sequelize from 'sequelize'
import { getNativeQuery } from '../../../native/nativeUtils'
import { setDefaultQuery } from '../../../utils/setQuery'
import moment from 'moment'

const vStock = dbv.vw_stock
const vStockList = dbvr.vw_stock_list
const tbStock = db.tbl_stock 
const Op = sequelize.Op

const attrStkOnHand = {
  mf: ["storeid", "storecode", "storename", "productid", "productcode", "productname", "brandid",
  "brandname", "qtystock", "qtypartition", "qtyonhand", "costprice", "costpricelocal", "costpriceglobal",
  "sellprice", "sellpricelocal", "sellpriceglobal", "distprice01", "distprice01local", "distprice01global",
  "distprice02", "distprice02local", "distprice02global", "categoryid", "categorycode", "categoryname", "max_disc",
  "max_disc_nominal","barcode01","curr_hpp", 'use_warranty', "valid_warranty_km", "valid_warranty_period", "shelf"
  ],
  bf: [
    "productcode", "productname","barcode01","brandname","qtyonhand","costprice","sellprice","distprice01",
    "distprice02","max_disc","max_disc_nominal","curr_hpp", "shelf"
  ],
  lov: ["productcode", "costprice"],
  existsStock: [
    'storeid', 'storecode', 'storename', 'storeaddress01','storeaddress02', 'storemobilenumber', 'storephonenumber'
  ]
}
const attrStock = {
  mf: ['id', "productcode", "productname", "barcode01", "barcode02"],
  lov: ["productcode", "productname", "barcode01", "barcode02"],
}

const attrVwStock = {
  mf: [
    'id', 'productcode', 'productname', 'variantid', 'barcode01', 'barcode02', 'othername01', 'othername02', 'location01',
    'location02', 'costprice', 'sellprice', 'sellpricepre', 'distprice01', 'distprice02', 'sectionwidth', 'aspectratio', 'rimdiameter', 'brandid',
    'brandname', 'categorycode', 'brandcode', 'categoryid', 'categoryparentid', 'categoryname', 'trackqty', 'alertqty', 'active', 'activestatus',
    'exception01', 'usagetimeperiod', 'usagemileage', 'productimage', 'dummycode', 'dummyname', 'createdby', 'createdat', 'updatedby', 'updatedat'
  ],
  bf: [
    'productcode', 'productname', 'variantid', 'barcode01', 'barcode02', 'othername01', 'othername02', 'location01',
    'location02', 'costprice', 'sellprice', 'sellpricepre', 'distprice01', 'distprice02', 'sectionwidth', 'aspectratio', 'rimdiameter',
    'brandname', 'categorycode', 'brandcode', 'categoryparentid', 'categoryname', 'trackqty', 'alertqty', 'active', 'activestatus',
    'exception01', 'usagetimeperiod', 'usagemileage', 'productimage', 'dummycode', 'dummyname', 'createdby', 'createdat', 'updatedby', 'updatedat'
  ],
  mnf: [
    'productcode', 'productname', 'barcode01', 'barcode02', 'costprice', 'sellprice', 'sellpricepre',
    'distprice01', 'distprice02', 'brandname', 'categorycode', 'brandcode', 'categoryname', 'active'
  ],
  lov: [
    'productcode', 'productname', 'categoryname', 'brandname'
  ]
}

export function srvGetStockQuery (query) {
  const { m, ...other } = query
  const tmpAttr = attrVwStock[m] || attrVwStock.lov
  let queryDefault = setDefaultQuery(attrVwStock.bf, other, true)

  return vStock.findAndCountAll({
    attributes: tmpAttr,
    ...queryDefault,
    raw: true
  })
}

const isEmptyOrNull = (text) => (typeof text === 'object' && !text) || text === ''
const primaryExists = (p) => p.productCode || p.productName || p.barcode01 || 'c1756fd6378e8f205666afd85127652c'
const restrictPrice = (p) => (
  (+p.costPrice < 1 && typeof p.costPrice !== 'object') || +p.distPrice01 < 1 || +p.distPrice02 < 1 || +p.sellPrice < 1
)


export function srvGetStockOnHand (query) {
  const {  m, page, pageSize, type, existsqty, ...other } = query || {}
  let extendWhere = {}
  let limit = {}
  if(['report', 'verify'].indexOf(type) === -1) {
    limit = {
      limit: +(pageSize || 20),
      offset: +(page - 1 || 0) * +(pageSize || 10)
    }
  }
  Object.getOwnPropertyNames(other || {}).map(att => {
    if(attrStkOnHand.mf.indexOf(att) !== -1) extendWhere[att] = { $iRegexp: other[att] }
  })
  const newAttr = type === 'report' ? [...attrStkOnHand.bf, 'qtyin', 'qtyout', 'active'] : attrStkOnHand.bf
  let newClause = type === 'report' ? { storeid: query.store } :
    { $and: [ { storeid: query.store }, { ...extendWhere, active: 1 } ]  }
  newClause = { ...newClause, ...((existsqty || false).toString() === 'true' ? { qtyonhand: { $gt: 0 } } : {}) }
  return vStockList.findAndCountAll({
    attributes: newAttr,
    where: newClause,
    raw: true,
    ...limit
  })
}

export function srvGetStockExists (data, allowDetail) {
  let otherProps = {}
  if((data.existsqty || false).toString() === 'true') {
    otherProps = { qtyonhand: { $gt: 0 } }
  }
  return vStockList.findAll({
    attributes: allowDetail ? attrStkOnHand.existsStock.concat(attrStkOnHand.bf) : attrStkOnHand.existsStock,
    where: { productcode: data.productcode, storeid: { $ne: data.store }, ...otherProps },
    raw: true,
    order: [['qtyonhand', 'desc'], ['storeid','asc']]
  })
}

export function srvValidationActiveOnhand (data, otherFilter = {}) {
  return vStockList.findAll({
    attributes: attrStkOnHand.existsStock,
    where: {
      $and: [{ productcode: data.productcode, active: 1, qtyonhand: { $gt: 0 } }, { active: { $ne: data.active } }, otherFilter]
    },
    raw: true,
    order: [['qtyonhand', 'desc'], ['storeid','asc']]
  })
}

export function srvGetSomeStockOnHand (product, storeid, mode) {
  return vStockList.findAll({
    attributes: mode ? attrStkOnHand[mode] : attrStkOnHand.mf,
    where: { $and: [ { productcode: { $in: product } }, { storeid } ]  },
    raw: true
  })
}

export function srvGetStockOnHandByScanner (product, storeid) {
  return vStockList.findOne({
    attributes: attrStkOnHand.bf,
    where: {
      $or: [{ productcode: product }, { barcode01: product }],
      storeid
    },
    raw: true
  })
}

export function srvGetSuggestionOrder ({ type, store, sox, date, rangedate }) {
  let sSql = null

  if(type === 'T01') {
    sSql =  `select * from fn_suggestion_order_01('${store}','${date}',${rangedate},${sox})`
  } else if (type === 'T02') {
    sSql =  `select * from fn_suggestion_order_02('${store}','${date}',${rangedate},${sox})`
  } else if (type === 'T03') {
    sSql =  `select * from fn_suggestion_order_03_tmp('${store}','${date}',${rangedate},${sox})`
  } else {
    throw 'Type is not defined.'
  }
  return getNativeQuery(sSql,false, 'RAW')
}

// bulk_update_product (data_json json, store int default null)
function createBulkObject (primary, updated, user) {
  const primaryText = primaryExists(primary)
  let msgError = `Couldn't updated ${primaryText}`
  let dtlError = ''
  if(primaryText === 'c1756fd6378e8f205666afd85127652c') {
    dtlError = 'No primary found'
    return { success: false, detail: dtlError, message: msgError }
  }
  if(restrictPrice(updated)) {
    dtlError = 'Price must be as number and included value must be greater than 0'
    return { success: false, detail: dtlError, message: msgError }
  }
  const retData = {
    ...(isEmptyOrNull(primary.productCode) ? {} : { p_productcode: primary.productCode } ),
    // ...(isEmptyOrNull(primary.productName) ? {} : { p_productname: primary.productName } ),
    ...(isEmptyOrNull(primary.qrCode) ? {} : { p_qrcode: primary.barcode01 } ),
    ...(isEmptyOrNull(updated.barcode01) ? {} : { u_qrcode: updated.barcode01 } ),
    ...(isEmptyOrNull(updated.productName) ? {} : { u_productname: updated.productName } ),
    ...(isEmptyOrNull(updated.sellPrice) && isLocalPrice ? {} : { u_sellprice: +updated.sellPrice } ),
    ...(isEmptyOrNull(updated.sellPricePre) && isLocalPrice ? {} : { u_sellpricepre: +updated.sellPricePre } ),
    ...(isEmptyOrNull(updated.costPrice) && isLocalPrice ? {} : { u_costprice: +updated.costPrice } ),
    ...(isEmptyOrNull(updated.distPrice01) && isLocalPrice ? {} : { u_distprice01: +updated.distPrice01 } ),
    ...(isEmptyOrNull(updated.distPrice02) && isLocalPrice ? {} : { u_distprice02: +updated.distPrice02 } ),
    ...(['A','N'].indexOf(updated.active) === -1 ? {} : { u_active: updated.active === 'A' ? 1 : 0 } ),
    updatedby: user,
    updatedat: moment()
  }
  return { success: true, data: retData }
}

export async function srvBulkUpdateGlobalProduct (data, storeid, user) {
  try {
    let errorLog = []
    let newData = []
    for (let item in data) {
      const tmpObject = createBulkObject(data[item].primary, data[item].updated, user)
      tmpObject.success ? newData.push(tmpObject.data) : errorLog.push(tmpObject)
    }
  
    const sSql = `select * from sch_pos.bulk_update_product('${JSON.stringify(newData)}','${storeid}')`
    const updatedProduct = await getNativeQuery(sSql,false, 'RAW')

    return { success: true, logReport: [ ...errorLog, ...JSON.parse(JSON.stringify(updatedProduct))[0] ] }
  } catch (er) {
    return { success: false, message: er.message }
  }
}

export async function srvGetTotalStock (data) {
  try {
    const { product, store, startat, endat } = data
    const newStartDate = moment(startat).format('YYYY-MM-DD')
    const newEndDate = moment(endat).format('YYYY-MM-DD')
  
    const sSql = `select * from sch_pos.fn_get_total_stock('${newStartDate}', '${newEndDate}', '${store}', ${product ? `'${JSON.stringify(product)}'` : null})`
    const getStock = await getNativeQuery(sSql,true, 'RAW')

    return { success: true, data: getStock[0] }
  } catch (er) {
    return { success: false, message: er.message }
  }
}


export function srvFindStockByCode (list_prod = '') {
  const newListProd = typeof list_prod === 'string' ? list_prod.split(',') : []
  return tbStock.findAll({
    attributes: attrStock.lov,
    where: {
      $or: [{ productcode: { $in: newListProd } }]
    },
    raw: true
  })
}

export function srvFindOneStockByCode (product = '') {
  return tbStock.findOne({
    attributes: attrStock.mf,
    where: {
      productcode: product
    },
    raw: true
  })
}

export function srvGetStockLOV (query) {
  const { m, storeid, ...other } = query
  let queryDefault = setDefaultQuery(attrStock.lov, other, true)
  queryDefault.where = { ...queryDefault.where }
  return tbStock.findAndCountAll({
    attributes: attrStock.lov,
    ...queryDefault,
    raw: true
  })
}

export function getHppStock(query) {
  const { storeCode, productCode } = query;

  const hppStock = `
    SELECT
      hrg_pokok as "hpp"
    FROM sch_erp_inventory.mv_hpp_periode_stock_baik
    WHERE kode_cabang = '${storeCode}' AND kode_barang = '${productCode}'
  `;

  return getNativeQuery(hppStock, false, 'CALL').then(result => {
    let rs = JSON.parse(JSON.stringify(result))[0];
    return { success: true, data: rs };
  }).catch(er => ({ success: false, message: er.message }));
}