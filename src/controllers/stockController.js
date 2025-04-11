/**
 * Created by panda .has .my .id on 4/17/27.
 */
import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import sequelize from '../native/sequelize'
import {
  setStockInfo, getStockByCode, getProductLocalByCode, stockExists, getStockLocalPrice,
  getStocksData, getProductsData, getProductsDataLocal, createStock, updateStock, deleteStock, deleteStocks,
  srvAlertedStocks, countData, srvStocksActiveZero, srvCountSyncProductPrice, srvSyncProductPrice,
  getStockPurchasePrice, srvGetUpdateLogStockPrice, checkBarcodeExists, srvGetSomeUpdateLogStockPrice
} from '../services/stockService'
import { srvValidationActiveOnhand } from '../services/v2/inventory/srvStocks'
import { srvGetSettingParentStore, srvGetStoresByCode } from '../services/v2/master/store/srvStore'
import { getSettingByCodeV2 } from '../services/settingService'
import { extractTokenProfile } from '../services/v1/securityService'


// Retrieve a stock
exports.getStock = function (req, res, next) {
  console.log('Requesting-getStock-global: ' + req.url + ' ...')
  const stockcode = req.params.id
  getStockByCode(stockcode).then((stock) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: stock
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Stock ${stockcode}.`, err)))
}

// Retrieve a stock - check local price
exports.getStockLocal = async function (req, res, next) {
  console.log('Requesting-getStock-local: ' + req.url + ' ...')
  const { productCode, storeId } = req.params
  let product

  try {
    const localProduct = await getProductLocalByCode(storeId, productCode)
    if (localProduct) {
      product = localProduct
    } else {
      const globalProduct = await getStockByCode(productCode)
      product = globalProduct
    }
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: product
    })
  } catch (err) {
    next(new ApiError(501, err + `ZPCC-0003. Couldn't find Product.`, err))
  }
}


exports.ctlGetSomeUpdateLogStockPrice = function (req, res, next) {
  console.log('Requesting-ctlGetSomeUpdateLogStockPrice: ' + req.url + ' ...')
  req.query.page = req.query.page || 1
  req.query.pageSize = req.query.pageSize || 100
  return srvGetSomeUpdateLogStockPrice(req.query).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs.rows,
      total: rs.count,
      page: req.query.page,
      pageSize: req.query.pageSize
    })
  }).catch(err => {
    next(new ApiError(422, `Couldn't Find Logs.`, err))
  })
}

exports.ctlGetUpdateLogStockPrice = function (req, res, next) {
  console.log('Requesting-ctlGetUpdateLogStockPrice: ' + req.url + ' ...')
  const store = req.query.store || null
  const product = req.params.product
  return srvGetUpdateLogStockPrice(product, store).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs,
      total: rs.length
    })
  }).catch(err => {
    next(new ApiError(422, `Couldn't Find Logs.`, err))
  })
}




// Retrieve list of stocks
exports.getStocks = function (req, res, next) {
  console.log('Requesting-ctl-getStocks: ' + req.url + ' ...')
  let { pageSize, page, store, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
  /* wi, 2019-09-25 use findAndCountAll
  // countData(other).then((count) => {
    /* wi, 2019-07-09
    clone from function getStocksData
    change to getProductsData, add with local price for multiple price store
    return getStocksData(other, pagination).then((data) => {
    */
    // return getProductsData(other, pagination).then((data) => {
    return getProductsData(other, pagination).then(async (data) => {
      const dataPurchasePrice = store ? await getStockPurchasePrice(store) : []
      
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: other.type === 'all' ? data.count : (pageSize || 10),
        page: page || 1,
        total: data.count,
        data: data.rows,
        dataPurchasePrice
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Stocks.`, err)))
  // }).catch(err => next(new ApiError(501, err + ` - Couldn't find Stocks.`, err)))
}

exports.getProducts = function (req, res, next) {
  console.log('Requesting-ctl-getProducts: ' + req.url + ' ...')
  let { pageSize, page, store, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
    return getStocksData(other, pagination).then(async (data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: other.type === 'all' ? data.count : (pageSize || 10),
        page: page || 1,
        total: data.count,
        data: data.rows
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Stocks.`, err)))
}

// Retrieve list of stocks with local price
exports.getStocksLocal = function (req, res, next) {
  console.log('Requesting-getStocksLocal: ' + req.url + ' ...')
  let { storeId } = req.params
  let { pageSize, page, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
  return getProductsDataLocal(storeId, other, pagination).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: other.type === 'all' ? data.count : (pageSize || 10),
      page: page || 1,
      total: data.count,
      data: data.rows
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Stocks.`, err)))
}

// Retrieve list of active stocks with zero quantity
exports.getStocksActiveZero = function (req, res, next) {
  console.log('Requesting-getStocksActiveZero' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  let pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  }
  if (other && other.hasOwnProperty('m')) {
    const mode = other.m.split(',')
    if (['ar','lov'].some(_ => mode.includes(_))) pagination = {}
  }
  return srvStocksActiveZero(req.query).then((data) => {
    let dt = JSON.parse(JSON.stringify(data))
    // const dataCount = dt.length > 0 ? dt[0].totalRows : 0
    // delete dt.totalRows
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      // total: dataCount,
      data: data
    })
  }).catch(err => next(new ApiError(422, `ZCMS-00001: Couldn't find stocks`, err)))
}

// Create a new stock
exports.insertStock = async function (req, res, next) {
  console.log('Requesting-insertStock: ' + req.url + ' ...')
  const stockcode = req.params.id
  const storecode = req.body.store
  const stock = req.body
  const userLogIn = extractTokenProfile(req)
  try {
    const currentSettingVal = await srvGetSettingParentStore(storecode, ['inventory','separate'])
    const existsBarcode = await checkBarcodeExists(stockcode, stock.barCode01)
    const exists = await stockExists(stockcode)
    if (exists || existsBarcode) {
      if(existsBarcode) {
        next(new ApiError(422, `Barcode ${stock.barCode01} has been exists.`))
      } else {
        next(new ApiError(409, `Stock ${stockcode} already exists.`))
      }
    } else {
      await createStock(stockcode, stock, userLogIn.userid, currentSettingVal, next)
      const stockGetByCode = await getStockByCode(stockcode)
      // let storeId, productId, localPrice
      // if (useLocalPrice) {
      //   storeId = ((((((stock||{}).inventory||{}).separate||{}))||{}).priceCurrent)
      //   productId = stockGetByCode.id
      //   localPrice = await getStockLocalPrice(storeId, productId)
      // }
      
      const stockInfo = setStockInfo(stockGetByCode)

      // if (localPrice) stockInfo.local = localPrice

      let jsonObj = {
        success: true,
        message: `Stock ${stockGetByCode.productCode} - ${stockGetByCode.productName} created`,
        stock: stockInfo
      }
      res.xstatus(200).json(jsonObj)
    }
  } catch (err) {
    next(new ApiError(501, err + `ZPCC-0001. Couldn't find Product.`, err))
  }
}

//Update a Stock
exports.updateStock = async function (req, res, next) {
  console.log('Requesting-updateStock: ' + req.url + ' ...')
  // const queryStoreList = 'select * from spr_get_store_list(:storeId)'
  const stockcode = req.body.id
  const storecode = req.body.store
  let stock = req.body.data
  const userLogIn = extractTokenProfile(req)
  try {
    const exists = await checkBarcodeExists(stockcode, stock.barCode01)
    // const settVal = ((await getSettingByCodeV2('Validation') || {}).settingvalue || {})
    const settVal = ((await getSettingByCodeV2('SETTAPPV') || {}).settingvalue || {})
    if (!exists) {
      const currentSettingVal = await srvGetSettingParentStore(storecode, ['inventory','separate'])

      // const currStore
      // const useLocalPrice = (((currentSettingVal.parent_setting || {}).price || false) || ((currentSettingVal.setting || {}).price || false))
      // const storeList = await sequelize.query(queryStoreList, {
      //   replacements: {storeId: currentSettingVal.storeid},
      //   type: sequelize.QueryTypes.CALL
      // })
      // const onHandActive = await srvValidationActiveOnhand(
      //   { productcode: stockcode, active: stock.active },
      //   { pricelocal: useLocalPrice }
      // )
      // const filterStore = useLocalPrice ? (storeList[0] || []).filter(x => onHandActive.map(z => z.storeid).indexOf(x.id) !== -1) : onHandActive
      
      const onHandActive = []

      // if(filterStore.length > 0 && settVal.checkActiveOnHand) {
      if(false) {
        res.xstatus(411).json({
          success: false,
          message: 'Reject Update Stock',
          detail: 'Non-Active stock is rejected, stock is used by other store.',
          data: filterStore
        })
      } else {
        stock = {
          ...stock,
          approval_flag: !!(settVal['STOCKPRICE'] || {}).ACTIVE
        }

        await updateStock(stockcode, stock, userLogIn.userid, currentSettingVal, null, next)

        // let storeId, productId, localPrice
        // if (useLocalPrice) {
        //   // storeId = ((((((stock||{}).inventory||{}).separate||{}))||{}).priceCurrent)
        //   productId = stockGetByCode.id
        //   localPrice = await getStockLocalPrice(currentSettingVal.storeid, productId)
        // }
        // const stockInfo = setStockInfo(stockGetByCode)
        // if (localPrice) stockInfo.local = localPrice

        let jsonObj = {
          success: true,
          message: `Product ${stockcode} has been updated`
          // stock: stockInfo
        }
        res.xstatus(200).json(jsonObj)
      }
    } else {
      next(new ApiError(422, `Barcode ${stock.barCode01} has been exists.`))
    }
  } catch (err) {
    next(new ApiError(501, err + `ZPCC-0002. Couldn't find Product.`, err))
  }
}

//Delete a Stock
exports.deleteStock = function (req, res, next) {
  console.log('Requesting-deleteStock: ' + req.url + ' ...')
  const stockcode = req.params.id
  stockExists(stockcode).then(exists => {
    if (exists) {
      return deleteStock(stockcode, next).then((stockDeleted) => {
        if (stockDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Stock ${stockcode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { stocks: stockDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Couldn't delete Stock ${stockcode}.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Stock ${stockcode}.`, err)))
    } else {
      next(new ApiError(422, `Stock ${stockcode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Stock ${stockcode} not exists.`, err)))
}

//Delete some Stock
exports.deleteStocks = function (req, res, next) {
  console.log('Requesting-deleteStocks: ' + req.url + ' ...')
  let stocks = req.body;
  deleteStocks(stocks, next).then((stockDeleted) => {
    if (stockDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Stocks [ ${stocks.productCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { stocks: stockDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete Stocks [ ${stocks.stockCode} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Stocks [ ${stocks.stockCode} ].`, err)))
}

// Retrieve list of product below minimum level
exports.getAlertedStocks = function (req, res, next) {
  console.log('Requesting-getAlertedStocks: ' + req.url + ' ...')
  const { store, start, end } = req.body
  if (!start || !end) {
    console.log('isnull')
  }
  // getPeriodActive(other.storeId).then((period) => {
  //
  // })
  srvAlertedStocks(store, start, end).then((alerted) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: Object.keys(alerted).length,
      data: alerted,
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Stocks.`, err)))
}

// Sync products price from parent to child
exports.syncProductPrice = async function (req, res, next) {
  console.log('Requesting-syncProductPrice:' + req.url + ' ...')
  const { userId, mode } = req.body
  const { storeId } = req.params
  try {
    const countBefore = await srvCountSyncProductPrice({storeId, mode:'F'})
    const countSync = await srvCountSyncProductPrice({storeId, mode})
    const results = await srvSyncProductPrice({storeId, userId, mode})
    const countAfter = await srvCountSyncProductPrice({storeId, mode:'F'})

    let jsonObj = {
      success: true,
      message: `Sync ${storeId} - ${mode} success`,
      data: {
        before: countBefore[0].countRecords,
        sync: countSync[0].countRecords,
        after: countAfter[0].countRecords
      }
    }
    res.xstatus(200).json(jsonObj)
  } catch (err) {
    next(new ApiError(501, err + `ZPCC-0004. Couldn't Sync product price for ${storeId}.`, err))
  }
}