import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'
import {
  srvGetStockOnHand, srvGetStockExists, srvGetSomeStockOnHand, srvGetStockOnHandByScanner, srvGetSuggestionOrder,
  srvBulkUpdateGlobalProduct, srvGetTotalStock, srvFindStockByCode, srvGetStockLOV, srvGetStockQuery, getHppStock
} from '../../../services/v2/inventory/srvStocks'
import { countUserRole } from '../../../services/v1/usersService'
import { getMiscByCodeName } from '../../../services/v1/miscService'
import { getStoreQuery } from '../../../services/setting/storeService'

export async function ctlGetStockOnHand (req, res, next) {
  console.log('Requesting-ctlGetStockOnHand: ' + JSON.stringify(req.params) + ' ...')
  const userLogin = req.$userAuth
  try {
    let pages = pages = {
      page: +(req.query.page || 1),
      pageSize: +(req.query.pageSize || 20)
    }
    if(['report', 'verify', 'monitor'].indexOf(req.query.type) !== -1) {
      const storeUserExists = await getStoreQuery({ user: userLogin.userid, store: userLogin.store }, 'userstoreexists')
      const storeEx = JSON.parse(JSON.stringify(storeUserExists))[0] || {}
      if(+storeEx.countstore === 0) {
        throw 'Access Denied'
      }
    }
    
    return srvGetStockOnHand({ ...req.query, store: userLogin.store }).then(stk => {
      res.xstatus(200).json({
        success: true,
        data: stk.rows,
        length: stk.count,
        total: stk.count,
        ...pages
      })
    }).catch(err => {
      return next(new ApiError(422, `ZCCA-00001: Couldn't find Stock`, err))
    })
  } catch (err) {
    return next(new ApiError(422, `ZCCA-00011: Access store has been rejected`, err))
  }
}

export async function ctlGetTotalStock (req, res, next) {
  console.log('Requesting-ctlGetTotalStock: ' + JSON.stringify(req.params) + ' ...')
  return srvGetTotalStock({ ...req.body }).then(totalStock => {
    if(totalStock.success) {
      res.xstatus(200).json({
        ...totalStock
      })
    } else {
      throw new Error(totalStock.message)
    }
  }).catch(err => next(new ApiError(422, `ZCCA-00003: `, err)))
}

export async function ctlGetStockExists (req, res, next) {
  console.log('Requesting-ctlGetStockExist: ' + JSON.stringify(req.params) + ' ...')
  const userLogin = req.$userAuth
  const roles = await getMiscByCodeName('PERMISSION', 'STOREEXISTS')

  const listRole = ((JSON.parse(JSON.stringify(roles)) || {}).miscVariable || '').split(',') || []
  return countUserRole(userLogin.userid, listRole).then(counts => {
    const showQty = (counts || 0) > 0 || listRole.indexOf('*') !== -1
    return srvGetStockExists({ ...req.query, productcode: req.params.code }, showQty).then(stk => {
      res.xstatus(200).json({
        success: true,
        data: stk,
        length: stk.length
      })
    }).catch(err => {
      next(new ApiError(422, `ZCCA-00004: Couldn't find Stock`, err))
    })
  }).catch(err => next(new ApiError(422, `ZCCA-00003: `, err)))
}


export function ctlGetSomeStockOnHand (req, res, next) {
  console.log('Requesting-ctlGetSomeStockOnHand: ' + JSON.stringify(req.params) + ' ...')
  return srvGetSomeStockOnHand((req.body.product || []), req.params.store, false).then(stk => {
    res.xstatus(200).json({
      success: true,
      data: stk,
      length: stk.length
    })
  }).catch(err => {
    next(new ApiError(422, `ZCCA-00005: Couldn't find Stock`, err))
  })
}

export function ctlGetStockOnHandByScanner (req, res, next) {
  console.log('Requesting-ctlGetStockOnHandByScanner: ' + JSON.stringify(req.params) + ' ...')
  return srvGetStockOnHandByScanner(req.query.product, req.params.store).then(stk => {
    res.xstatus(200).json({
      success: true,
      data: stk
    })
  }).catch(err => {
    next(new ApiError(422, `ZCCA-00006: Couldn't find Stock`, err))
  })
}

export function ctlGetSuggestionOrder (req, res, next) {
  console.log('Requesting-ctlGetSuggestionOrder: ' + JSON.stringify(req.params) + ' ...')
  return srvGetSuggestionOrder(req.query).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: JSON.parse(JSON.stringify(rs))[0]
    })
  }).catch(err => {
    next(new ApiError(422, `ZCCA-00006: Couldn't find Suggestion Order`, err))
  })
}

export function ctlBulkUpdateGlobalProduct (req, res, next) {
  console.log('Requesting-ctlBulkUpdateGlobalProduct: ' + JSON.stringify(req.params) + ' ...')
  const userLogin = req.$userAuth
  return srvBulkUpdateGlobalProduct(req.body.data, req.body.store, userLogin.userid).then(rs => {
    if(rs.success) {
      res.xstatus(200).json({
        success: true,
        data: rs.logReport
      })
    } else {
      throw new Error(rs.message)
    }
  }).catch(err => next(new ApiError(422, `ZCCA-00007: Couldn't update stock`, err)))
}


export function ctlFindStockByCode (req, res, next) {
  console.log('Requesting-ctlFindStockByCode: ' + JSON.stringify(req.params) + ' ...')
  return srvFindStockByCode(req.body.list_prod).then(ext => {
    res.xstatus(200).json({
      success: true,
      data: ext
    })
  }).catch(err => next(new ApiError(422, `ZCCA-00008: Couldn't get stock`, err)))
}

export function ctlGetStockLOV (req, res, next) {
  console.log('Requesting-ctlGetStockLOV: ' + JSON.stringify(req.params) + ' ...')
  return srvGetStockLOV(req.query).then(stock => {
    res.xstatus(200).json({
      success: true,
      data: stock.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: stock.count,
    })
  }).catch(err => next(new ApiError(422, `ZCCA-00009: Couldn't get stock`, err)))
}



export function ctlGetStockQuery (req, res, next) {
  console.log('Requesting-ctlGetStockQuery: ' + JSON.stringify(req.params) + ' ...')
  return srvGetStockQuery(req.query).then(stock => {
    res.xstatus(200).json({
      success: true,
      data: stock.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: stock.count,
    })
  }).catch(err => next(new ApiError(422, `ZCCA-00010: Couldn't get stock`, err)))
}

export function ctlFindHppStock (req, res, next) {
  console.log('Requesting-ctlFindHppStock: ' + JSON.stringify(req.params) + ' ...')
  return getHppStock(req.body).then(ext => {
    res.xstatus(200).json({
      success: true,
      data: ext.data
    })
  }).catch(err => next(new ApiError(422, `ZCCA-00011: Couldn't get HPP`, err)))
}