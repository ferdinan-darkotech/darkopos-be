import db from '../models'
import dbr from '../models/tableR'
import dbv from '../models/view'
import dbvr from '../models/viewR'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
import sequelize from '../native/sequelize'
import Sequelize from 'sequelize'
import native from '../native/product/sqlStockQty'
import { getNativeQuery } from '../native/nativeUtils'
import { setDefaultQuery } from '../utils/setQuery'
import moment from 'moment'

const sqlGetStoreList = "select * from spr_get_store_list(:storeId)"

const Stock = db.tbl_stock
const vwStock = dbv.vw_stock
const vwStockSpecification001 = dbv.vw_stock_specification

const productPriceLocal = dbr.tbd_product_price
const vw_product = dbvr.vw_product
const vw_products = dbvr.vw_products
const vwProductLocal = dbvr.vw_product_local
const vwLogUpdateStockPrice = dbvr.vw_log_update_stock_price
const vwtLogUpdateStockPrice = dbvr.vw_tmp_log_update_stock_price
const tbLogUpdateStockPrice = dbr.tbl_tmp_log_update_stock_price
const vwiProductPrice001 = dbvr.vwi_product_price
const vwiLastProductPurchasePrice = dbvr.vw_last_purchase_price

const specFields = [
  'id',
  'productId',
  'productCode',
  'productName',
  'categoryCode',
  'categoryName',
  'specificationId',
  'name',
  'value',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt'
]

vwStock.hasMany(vwStockSpecification001, { as: 'specification', foreignKey: 'productId', targetKey: 'id' })
vw_product.hasMany(vwStockSpecification001, { as: 'specification', foreignKey: 'productId', targetKey: 'id' })
vwProductLocal.hasMany(vwStockSpecification001, { as: 'specification', foreignKey: 'productId', targetKey: 'id' })
// vwProductLocal.hasMany(vwStockSpecification001, { as: 'specification', foreignKey: 'productId', targetKey: 'id' })

const include = [
  { model: vwStockSpecification001, as: 'specification', attributes: specFields },
]

const stockFields = ['id', 'variantId', 'productParentId', 'productCode', 'productName', 'barCode01', 'barCode02',
  'otherName01', 'otherName02', 'location01', 'location02',
  'costPrice', 'sellPrice', 'distPrice01', 'distPrice02', 'sellPricePre',
  'sectionWidth', 'aspectRatio', 'rimDiameter',
  'brandId', 'brandName', 'categoryId', 'categoryName', 'trackQty', 'alertQty',
  'active', 'exception01', 'usageTimePeriod', 'usageMileage', 'productImage', 'dummyCode', 'dummyName',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'max_disc'
]

const stockFieldsV2 = ['id', 'productCode', 'productName', 'barCode01', 'barCode02',
  'otherName01', 'otherName02', 'location01', 'location02',
  'costPrice', 'sellPrice', 'distPrice01', 'distPrice02', 'sellPricePre',
  'sectionWidth', 'aspectRatio', 'rimDiameter',
  'brandId', 'brandName', 'categoryId', 'categoryName', 'trackQty', 'alertQty',
  'active', 'exception01', 'usageTimePeriod', 'usageMileage', 'productImage', 'dummyCode', 'dummyName',
  'use_warranty', 'valid_warranty_km', 'valid_warranty_period', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

const stockFieldsNormalize = ['id', 'productCode', 'productName',
  'brandCode', 'brandName', 'categoryCode', 'categoryName', 'active'
]

const columnLocalPrice = ['storeId', 'costPriceLocal', 'sellPriceLocal', 'distPrice01Local', 'distPrice02Local', 'sellPricePreLocal']
const stockFieldsLocal = stockFields.concat(columnLocalPrice)
const searchField = ['productCode', 'productName', 'barCode01']
const productFieldsMin = ['storeId', 'productId', 'productCode'].concat(columnLocalPrice)
const productFields = [
  'productId', 'productCode', 'productName', 'barCode01', 'barCode02', 'otherName01', 'otherName02',
  'location01', 'location02', 'costPrice', 'sellPrice', 'sellPricePre', 'distPrice01', 'distPrice02',
  'brandId', 'categoryId', 'trackQty', 'alertQty', 'active', 'exception01', 'usageTimePeriod', 'usageMileage',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

const attrLogsProductUpdated = {
  mf: [
    'storeid', 'productid', 'productcode', 'productname', 'costprice', 'sellprice', 'sellpricepre', 'distprice01', 'distprice02', 'old_costprice',
    'old_sellprice', 'old_sellpricepre', 'old_distprice01', 'old_distprice02', 'createdby', 'createdat'
  ],
  bf: [
    'productcode', 'productname', 'costprice', 'sellprice', 'sellpricepre', 'distprice01', 'distprice02', 'old_costprice',
    'old_sellprice', 'old_sellpricepre', 'old_distprice01', 'old_distprice02', 'createdby', 'createdat'
  ]
}

let productFieldsWithLocal = stockFields.concat(productFieldsMin)
var index = productFieldsWithLocal.indexOf('productId')
if (index !== -1) productFieldsWithLocal.splice(index, 1)


export function srvGetUpdateLogStockPrice (product, store) {
  return vwLogUpdateStockPrice.findAll({
    attributes: attrLogsProductUpdated.bf,
    where: { productcode: product, storeid: store },
    raw: true,
    order: [['createdat', 'desc']]
  })
}

export function srvGetSomeUpdateLogStockPrice ({ priceType, store, from, to = '', ...other }) {
  try {
    let where = {}

    if(!priceType) throw new Error('Type Price cannot be null or empty.')
    else if(!store) throw new Error('Store cannot be null or empty.')
    else if(!from || Number.isNaN(+from)) throw new Error('Start of range time must be type of datetime.')
    else if(!to || Number.isNaN(+to)) throw new Error('End of range time must be type of datetime.')

    if(priceType === 'local') {
      where = { storeid: store }
    } else if (priceType === 'global') {
      where = { storeid: { $eq: null } }
    } else {
      throw new Error('Type price is not found.')
    }

    let queryDefault = setDefaultQuery(attrLogsProductUpdated.bf, { ...other }, true)

    queryDefault.where = {
      ...queryDefault.where,
      ...where,
      createdat: { $between: [new Date(+from), new Date(+to)] }
    }
    
    return vwLogUpdateStockPrice.findAndCountAll({
      attributes: attrLogsProductUpdated.bf,
      ...queryDefault,
      order: [['createdat', 'desc']],
      raw: true
    })
  } catch (er) {
    throw new Error(er.message)
  }
}

export function srvGetBroadcastLogProductsUpdate () {
  return vwtLogUpdateStockPrice.findAll({
    attributes: ['storecode', 'storename', 'productcode', Sequelize.literal('count(1) as counts')],
    group: ['storecode', 'storename', 'productcode'],
    raw: true
  })
}


export function srvSetBroadcastProducts (createdAt = moment()) {
  return tbLogUpdateStockPrice.destroy({
    where: {
      createdat: { $lte: createdAt }
    } 
  })
}

export function getStockPurchasePrice (storeid) {
  return vwiLastProductPurchasePrice.findAll({
    attributes: ['productid', 'lst_purchaseprice'],
    where: {
      storeid
    },
    raw: false
  })
}

export function getStockByCode (stockcode) {
  return vwStock.findOne({
    where: {
      productCode: stockcode
    },
    raw: false
  })
}

export function checkBarcodeExists (stockcode, barcode) {
  return Stock.findOne({
    where: { productCode: { $ne: stockcode }, $and: [{ barCode01: barcode },{ barCode01: { $ne: null }, barCode01: { $ne: '' } }] },
    raw: true
  })
}

export function getProductLocalByCode (storeId, productCode) {
  return vwProductLocal.findOne({
    attributes: productFieldsWithLocal,
    where: {
      storeId, productCode
    },
    raw: false
  })
}

export function getStockLocalPrice (storeId, productId) {
  return vwiProductPrice001.findOne({
    attributes: productFields,
    where: {
      storeId
    },
    raw: false
  })
}

export function countData (query) {
  const { type, field, lov, order, q, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { $iRegexp: query[key] }
    }
  }
  if (lov === 'variant') {
    other.productParentId = {
      $eq: sequelize.literal('id')
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in stockFields) {
      const id = Object.assign(stockFields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || id === 'type')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vwStock.count({
      where: {
        $or: querying,
        $and: other
      },
    })
  } else {
    return vwStock.count({
      where: {
        ...other
      }
    })
  }
}

export function getStocksData (query, pagination) {
  const { type, field, lov, order, q, category, brand, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  const { pageSize, page } = pagination
  if (lov === 'variant') {
    other.productParentId = {
      $eq: sequelize.literal('id')
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in stockFieldsNormalize) {
      const id = Object.assign(stockFieldsNormalize)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || id === 'type' || id === 'id' || id === 'active')) {
        let obj = {}
        obj[id] = { $iRegexp: query['q'] }
        querying.push(obj)
      }
    }
  }

  const extendableFilter = {
    ...(category ? { categorycode: category } : {}),
    ...(brand ? { brandcode: brand } : {})
  }
  if (querying.length > 0) {
    return vwStock.findAndCountAll({
      attributes: stockFieldsNormalize,
      where: {
        $or: querying,
        $and: [...other, extendableFilter]
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return vwStock.findAndCountAll({
      attributes: stockFieldsNormalize,
      where: {
        ...other,
        ...extendableFilter
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function getProductsData (query, pagination) {
  /* wi, 2019-07-09
  clone from function getStocksData
  change to getProductsData, add with local price for multiple price store
  */
  const { type, field, lov, order, q, active, storecode: store, ...other } = query
  if (other.hasOwnProperty('createdAt')) {
    if (other.createdAt.length === 2) other.createdAt = { $between: other.createdAt }
  }
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  const { pageSize, page } = pagination
  if (lov === 'variant') {
    other.productParentId = {
      $eq: sequelize.literal('id')
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in searchField) {
      const id = Object.assign(searchField)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || id === 'type')) {
        let obj = {}
        // obj[id] = query['q']
        obj[id] = { $iRegexp: query['q'] }
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vw_products.findAndCountAll({
      attributes: stockFieldsV2, //stockFieldsLocal,
      where: {
        $or: querying,
        $and: [...other, [{ storecode: store }]]
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return vw_products.findAndCountAll({
      attributes: stockFieldsV2, // stockFieldsLocal,
      where: {
        ...other,
        storecode: store
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}


export function getProductsDataLocal (storeId, query, pagination) {
  /* wi, 2019-07-09
  clone from function getStocksData
  change to getProductsData, add with local price for multiple price store
  */
  const { type, field, lov, order, q, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  const { pageSize, page } = pagination
  if (lov === 'variant') {
    other.productParentId = {
      $eq: sequelize.literal('id')
    }
  }
  let querying = []
  if (query['q']) {
    querying.push(
      { productCode: { $iRegexp: query['q'] } },
      { productName: { $iRegexp: query['q'] } }
    )
    // for (let key in stockFieldsLocal) {
    //   const id = Object.assign(stockFieldsLocal)[key]
    //   if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || id === 'type')) {
    //     let obj = {}
    //     obj[id] = query['q']
    //     querying.push(obj)
    //   }
    // }
  }
  if (querying.length > 0) {
    const { browse, ...condition } = other
    return vwProductLocal.findAndCountAll({
      attributes: field ? field.split(',') : stockFieldsLocal,
      where: {
        $and: [
          { $or: [{ storeId }, { storeId: { $eq: null} }] },
          { $or: querying },
          { $and: condition }
        ]
        ,
      },
      include,
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return vwProductLocal.findAndCountAll({
      attributes: field ? field.split(',') : stockFieldsLocal,
      where: {
        ...other
      },
      include,
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function setStockInfo (request) {
  const getStockInfo = {
    id: request.id,
    productCode: request.productCode,
    productName: request.productName,
    barCode01: request.barCode01,
    barCode02: request.barCode02,
    otherName01: request.otherName01,
    otherName02: request.otherName02,
    location01: request.location01,
    location02: request.location02,
    costPrice: request.costPrice,
    sellPrice: request.sellPrice,
    distPrice01: request.distPrice01,
    distPrice02: request.distPrice02,
    distNominal: request.distNominal,
    sectionWidth: request.sectionWidth,
    aspectRatio: request.aspectRatio,
    rimDiameter: request.rimDiameter,
    brandId: request.brandId,
    categoryId: request.categoryId,
    trackQty: +request.trackQty,
    alertQty: request.alertQty,
    active: +request.active,
    exception01: +request.exception01,
    usageTimePeriod: request.usageTimePeriod,
    usageMileage: request.usageMileage,
    productImage: request.productImage,
    dummyCode: request.productCode,
    dummyName: request.productName
  }

  return getStockInfo
}

export function stockExists (stockCode) {
  return getStockByCode(stockCode).then(stock => {
    if (stock == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function productLocalExists (storeId, productCode) {
  return getProductLocalByCode(storeId, productCode).then(product => {
    if (product == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export async function createStock (stockcode, stock, createdBy, currentSettingVal, next) {
  let transaction
  let tmpStock = { ...stock }
  try {
    transaction = await sequelize.transaction()
    const localPrice = (((currentSettingVal.parent_setting || {}).price || false) || ((currentSettingVal.setting || {}).price || false))
    tmpStock.active = localPrice ? false : stock.active
    const stkGlobal = await createStockGlobal(stockcode, tmpStock, createdBy, next, transaction)
    if (localPrice) {
      tmpStock = {
        ...stock,
        active: stock.active
      }
      const product = JSON.parse(JSON.stringify(stkGlobal))
      const storeId = currentSettingVal.storeid
      const storeList = await sequelize.query(sqlGetStoreList, {
        replacements: { storeId: storeId },
        type: sequelize.QueryTypes.CALL
      })
      
      const timeat = moment()
      const storeIdList = storeList[0].map(x=>x.id)
      for (let i = storeIdList.length-1; i >= 0; i--) {
        await createStockLocal(storeIdList[i], product.id, tmpStock, createdBy, next, timeat, transaction)
      }
    }
    await transaction.commit()
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    const { parent, original, sql, ...other } = error
    next(new ApiError(422, error + `Couldn't create ${stockcode}.`, error))
  }
}

export function createStockGlobal (stockcode, stock, createdBy, next, transaction) {
  return Stock.create({
    productCode: stockcode,
    productName: stock.productName,
    barCode01: stock.barCode01,
    barCode02: stock.barCode02,
    otherName01: stock.otherName01,
    otherName02: stock.otherName02,
    location01: stock.location01,
    location02: stock.location02,
    costPrice: stock.costPrice,
    sellPrice: stock.sellPrice,
    distPrice01: stock.distPrice01,
    distPrice02: stock.distPrice02,
    distPrice03: stock.distPrice03,
    distNominal: stock.distNominal,
    sectionWidth: stock.sectionWidth,
    aspectRatio: stock.aspectRatio,
    rimDiameter: stock.rimDiameter,
    brandId: stock.brandId,
    categoryId: stock.categoryId,
    trackQty: +stock.trackQty,
    alertQty: stock.alertQty,
    active: +stock.active,
    exception01: +stock.exception01,
    productImage: stock.stockImage,
    dummyCode: stockcode,
    dummyName: stock.productName,
    usageTimePeriod: stock.usageTimePeriod,
    usageMileage: stock.usageMileage,
    use_warranty: stock.use_warranty,
    valid_warranty_km: stock.valid_warranty_km,
    valid_warranty_period: stock.valid_warranty_period,
    createdBy: createdBy,
    createdAt: moment(),
    updatedBy: '---'
  }, { transaction }).catch(err => {
    console.log(err)
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function createStockLocal(storeId, productId, data, createdBy, next, timeat, transaction) {
  return productPriceLocal.create({
    storeId,
    productId,
    costPrice: data.costPriceLocal,
    sellPrice: data.sellPriceLocal,
    distPrice01: data.distPrice01Local,
    distPrice02: data.distPrice02Local,
    sellPricePre: data.sellPricePreLocal,
    active: +data.active === 1,
    createdBy: createdBy,
    createdAt: timeat,
    updatedBy: '---'
  }, { transaction }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export async function updateStock (stockcode, stock, updateBy, currentSettingVal, storeList, next) {
  let transaction
  try {
    transaction = await sequelize.transaction()
    const localPrice = (((currentSettingVal.parent_setting || {}).price || false) || ((currentSettingVal.setting || {}).price || false))

    if (localPrice) {
      const product = await getStockByCode(stockcode)
      const { id: product_id } = (product.dataValues || {})
      const storeId = currentSettingVal.storeid
      // const storeIdList = storeList[0].map(x=>x.id)
      const timeat = moment()
      // for (let i = storeIdList.length-1; i >= 0; i--) {
      //   const productExists = await productLocalExists(storeIdList[i], stockcode)
        
      // }
      const productExists = await productLocalExists(currentSettingVal.storeid, stockcode)
      if (productExists) {
        await updateStockLocal(currentSettingVal.storeid, product_id, stock, updateBy, next, timeat, transaction)
      } else {
        await createStockLocal(currentSettingVal.storeid, product_id, stock, updateBy, next, timeat, transaction)
      }
    }
    await updateStockGlobal(stockcode, stock, updateBy, next, localPrice)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = error
    next(new ApiError(422, error + `Couldn't update ${stockcode}.`, error))
  }
}

export function updateStockGlobal(stockcode, stock, updateBy, next, localPrice) {
  const seperate = !localPrice ? {
    costPrice: stock.costPrice,
    sellPrice: stock.sellPrice,
    distPrice01: stock.distPrice01,
    distPrice02: stock.distPrice02,
    sellPricePre: stock.sellPricePre,
    distNominal: stock.distNominal,
    active: +stock.active,
    approval_flag: stock.approval_flag,
  } : {}
  return Stock.update({
    productName: stock.productName,
    barCode01: stock.barCode01,
    barCode02: stock.barCode02,
    otherName01: stock.otherName01,
    otherName02: stock.otherName02,
    location01: stock.location01,
    location02: stock.location02,
    sectionWidth: stock.sectionWidth,
    aspectRatio: stock.aspectRatio,
    rimDiameter: stock.rimDiameter,
    brandId: stock.brandId,
    categoryId: stock.categoryId,
    trackQty: +stock.trackQty,
    alertQty: stock.alertQty,
    ...seperate,
    exception01: +stock.exception01,
    usageTimePeriod: stock.usageTimePeriod,
    usageMileage: stock.usageMileage,
    use_warranty: stock.use_warranty,
    valid_warranty_km: stock.valid_warranty_km,
    valid_warranty_period: stock.valid_warranty_period,
    productImage: stock.stockImage,
    dummyCode: stockcode,
    dummyName: stock.productName,
    updatedBy: updateBy,
    updatedAt: moment()
  },
    { where: { productCode: stockcode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function updateStockLocal(storeId, productId, data, updateBy, next, timeat, transaction) {
  return productPriceLocal.update({
    active: +data.active === 1,
    costPrice: data.costPriceLocal,
    sellPrice: data.sellPriceLocal,
    distPrice01: data.distPrice01Local,
    distPrice02: data.distPrice02Local,
    sellPricePre: data.sellPricePreLocal,
    approval_flag: data.approval_flag,
    updatedBy: updateBy,
    updatedAt: timeat || moment()
  },
    { where: { storeId, productId } },
    { transaction }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteStock (stockcode, next) {
  return Stock.destroy({
    where: {
      productCode: stockcode
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteStocks (stocks, next) {
  if (!isEmpty(stocks)) {
    return Stock.destroy({
      where: stocks
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}

const stringSQL = {
  s00001: native.sqlAlertQty,
  s00002: native.sqlActiveZeroQty,
  s00003: native.sqlCheckProductPrice,
  s00004: native.sqlSyncProductPrice
}

export function srvAlertedStocks (store, start, end) {
  const sSQL = stringSQL.s00001
    .replace("_BIND01", store)
    .replace("_BIND02", start)
    .replace("_BIND03", end)
  return getNativeQuery(sSQL, true)
}

export function srvStocksActiveZero (query, filter) {
  let { store, period, pageSize, page } = query
  let limitQuery = ''
  if ( page && pageSize) limitQuery = String(parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)) + ',' + String(parseInt(pageSize || 10, 10))
  if (!filter) {
    store = 1
    period = moment().format('YYYY-MM-DD')
    limitQuery = ''
  }
  const sSQL = stringSQL.s00002
    .replace("_BIND01", store)
    .replace("_BIND02", period)
  return getNativeQuery(sSQL, false, 'CALL')
}

export function srvCountSyncProductPrice (query) {
  let { storeId, mode } = query

  const sSQL = stringSQL.s00003
    .replace("_BIND01", storeId)
    .replace("_BIND02", mode) //mode=P(arent; count from Parent); mode=C(hild; count from Child); mode=F(inish; count current)
  return getNativeQuery(sSQL, false, 'CALL')
}

export function srvSyncProductPrice (query) {
  let { storeId, userId, mode } = query

  const sSQL = stringSQL.s00004
    .replace("_BIND01", storeId)
    .replace("_BIND02", userId)
    .replace("_BIND03", mode) //mode=P(arent; sync from Parent); mode=C(hild; sync from Child)
  return getNativeQuery(sSQL, false, 'CALL')
}


export function srvGetSomeProductById (id = [], storeId) {
  return vwProductLocal.findAll({
    attributes: ['id', 'productCode', 'productName','costPrice', 'costPriceLocal'],
    where: { id: { $in: id }, storeId },
    raw: true
  })
}

export function srvGetSomeProductByCode (code = []) {
  return vw_product.findAll({
    attributes: [['id', 'productid'], 'productcode', 'productname'],
    where: { productcode: { $in: code } },
    raw: true
  })
}

export function srvGetSomeProductPriceByCode (code = []) {
  return vw_product.findAll({
    attributes: [['id', 'productid'], 'productcode', 'costprice', 'sellprice', 'distprice01', 'distprice02'],
    where: { productcode: { $in: code } },
    raw: true
  })
}