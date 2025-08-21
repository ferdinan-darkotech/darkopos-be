import { ApiError } from '../../../../services/v1/errorHandlingService'
import * as shelfs from '../../../../services/v2/master/stocks/srvShelf'
import * as stores from '../../../../services/v2/master/store/srvStore'

export function ctlGetSomeShelfs (req, res, next) {
  console.log('Requesting-ctlGetSomeShelfs: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))

  const userLogin = req.$userAuth
  return stores.srvGetAllStore({ ownedOnly: 'Y', m: 'lov' }, userLogin.userid).then(stores => {
    const storeCodes = JSON.parse(JSON.stringify(stores)).map(a => a.storeCode)
    
    return shelfs.srvGetSomeShelfs(storeCodes, req.query).then(rld => {
      res.xstatus(200).json({
        success: true,
        data: rld.rows,
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 20,
        total: rld.count
      })
    }).catch(err => next(new ApiError(422, `ZSHELF-00002: Couldn't find shelfs.`, err)))
  }).catch(err => next(new ApiError(422, `ZSHELF-00001: Couldn't find shelfs.`, err)))
}

export function ctlGetShelfOfProducts (req, res, next) {
  console.log('Requesting-ctlGetSomeShelfs: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  const userLogin = req.$userAuth
  return shelfs.srvGetShelfOfProducts(userLogin.store, Array.isArray(req.body) ? req.body : []).then(items => {
    res.xstatus(200).json({
      success: true,
      data: items,
      total: items.length
    })
  }).catch(err => next(new ApiError(422, `ZSHELF-00002.1: Couldn't find shelfs.`, err)))
}

export function ctlGetSomeShelfItems (req, res, next) {
  console.log('Requesting-ctlGetSomeShelfItems: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))

  const userLogin = req.$userAuth
  return stores.srvGetAllStore({ ownedOnly: 'Y', m: 'lov' }, userLogin.userid).then(stores => {
    const storeCodes = JSON.parse(JSON.stringify(stores)).map(a => a.storeCode)
    
    return shelfs.srvGetSomeShelfItems(storeCodes, req.query).then(rld => {
      res.xstatus(200).json({
        success: true,
        data: rld.rows,
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 20,
        total: rld.count
      })
    }).catch(err => next(new ApiError(422, `ZSHELF-00004: Couldn't find shelfs.`, err)))
  }).catch(err => next(new ApiError(422, `ZSHELF-00003: Couldn't find shelfs.`, err)))
}

export function ctlCreateShelf (req, res, next) {
  console.log('Requesting-ctlCreateShelf: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))

  const userLogin = req.$userAuth
  const data = req.body
  return stores.srvGetExistingUserStore(userLogin.userid, data.store).then(stores => {
    const newPayloads = {
      store_code: data.store,
      row_numbers: data.row_numbers,
      shelf_numbers: data.shelf_numbers,
      status: data.status,
      users: userLogin.userid
    }
    return shelfs.srvCreateShelf(newPayloads).then(rld => {
      res.xstatus(200).json({
        success: true,
        message: 'Data has been saved.'
      })
    }).catch(err => next(new ApiError(422, `ZSHELF-00006: Couldn't create shelfs.`, err)))
  }).catch(err => next(new ApiError(422, `ZSHELF-00005: Couldn't create shelfs.`, err)))
}


export function ctlUpdateShelf (req, res, next) {
  console.log('Requesting-ctlUpdateShelf: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))

  const userLogin = req.$userAuth
  const data = req.body
  return stores.srvGetExistingUserStore(userLogin.userid, data.store).then(async stores => {
    const newPayloads = {
      store_code: data.store,
      row_numbers: data.row_numbers,
      shelf_numbers: data.shelf_numbers,
      status: data.status,
      users: userLogin.userid
    }
    return shelfs.srvUpdateShelf(req.params.ids, newPayloads).then(rld => {
      res.xstatus(200).json({
        success: true,
        message: 'Data has been updated.'
      })
    }).catch(err => next(new ApiError(422, `ZSHELF-00008: Couldn't update shelfs.`, err.message)))
  }).catch(err => next(new ApiError(422, `ZSHELF-00007: Couldn't update shelfs.`, err.message)))
}


export function ctlImportShelfItems (req, res, next) {
  console.log('Requesting-ctlImportShelfItems: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))

  const userLogin = req.$userAuth
  return stores.srvGetAllStore({ ownedOnly: 'Y', m: 'lov' }, userLogin.userid).then(stores => {
    const storeCodes = JSON.parse(JSON.stringify(stores)).map(a => a.storeCode)
    
    return shelfs.srvImportShelfItems(storeCodes, req.body, userLogin.userid).then(rld => {
      if(rld.success) {
        res.xstatus(200).json({
          success: true,
          message: rld.message,
          data: {
            ...rld.feedbacks
          }
        })
      } else {
        throw new Error(rld.message)
      }
    }).catch(err => next(new ApiError(422, `ZSHELF-00010: Couldn't import shelf items.`, err)))
  }).catch(err => next(new ApiError(422, `ZSHELF-00009: Couldn't import shelf items.`, err)))
}

export function ctlBulkDeleteShelfItems (req, res, next) {
  console.log('Requesting-ctlBulkDeleteShelfItems: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))

  const userLogin = req.$userAuth
  return stores.srvGetAllStore({ ownedOnly: 'Y', m: 'lov' }, userLogin.userid).then(stores => {
    const storeCodes = JSON.parse(JSON.stringify(stores)).map(a => a.storeCode)
    
    return shelfs.srvBulkDeleteShelfItems(storeCodes, req.body).then(rld => {
      if(rld.success) {
        res.xstatus(200).json({
          success: true,
          message: rld.message,
          data: {
            ...rld.feedbacks
          }
        })
      } else {
        throw new Error(rld.message)
      }
    }).catch(err => next(new ApiError(422, `ZSHELF-00012: Couldn't delete shelf items.`, err)))
  }).catch(err => next(new ApiError(422, `ZSHELF-00011: Couldn't delete shelf items.`, err)))
}


// [EXPORT SHELF ITEM]: FERDINAN - 21/08/2025
export function ctlGetShelfItemsForReport (req, res, next) {
  console.log('Requesting-ctlGetShelfItemsForReport: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))

  const userLogin = req.$userAuth
  return stores.srvGetAllStore({ ownedOnly: 'Y', m: 'lov' }, userLogin.userid).then(stores => {
    const storeCodes = JSON.parse(JSON.stringify(stores)).map(a => a.storeCode)
    console.log("storeCodes >>> ", storeCodes)
    
    return shelfs.fetchAllShelftItems(storeCodes).then(rld => {
      res.xstatus(200).json({
        success: true,
        data: rld,
      })
    }).catch(err => next(new ApiError(422, `ZSHELF-00014: Couldn't find shelfs item for report.`, err)))
  }).catch(err => next(new ApiError(422, `ZSHELF-00013: Couldn't find shelfs item for report.`, err)))
}
