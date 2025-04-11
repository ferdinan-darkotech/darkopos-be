import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import {
  srvGetLogProductTradeIn, srvGetProductTradeIn, srvModifierProductTradeIn,
  srvGetExistsTradeInByStoreProducts, srvGetStockProductTradeIn,
  srvGetStockProductSecond, srvGetStockTradeInPerInvoices
} from '../../../../services/v2/master/stocks/srvProductTradeIN'
import { srvFindOneStockByCode } from '../../../../services/v2/inventory/srvStocks'
import { srvGetStoreByCode } from '../../../../services/setting/storeService'
import { srvGetStoreBranch, srvFindAllStoreByParent } from '../../../../services/v2/master/store/srvStore'
import { extractTokenProfile } from '../../../../services/v1/securityService'

export function ctlGetLogProductTradeIN (req, res, next) {
  console.log('Requesting-ctlGetLogProductTradeIN: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))

  return srvGetLogProductTradeIn(req.params.id).then(logs => {
    res.xstatus(200).json({
      success: true,
      data: logs,
      total: logs.length
    })
  }).catch(err => next(new ApiError(422, `ZMSTRDIN-00001: Couldn't find log product trade in`, err)))
}

export function ctlGetStockProductTradeIn (req, res, next) {
  console.log('Requesting-ctlGetStockProductTradeIn: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  
  const userLogin = req.$userAuth
  return srvGetStoreBranch(userLogin.store).then(branch => {
    if(!branch) throw new Error('Branch is not initialized.')
    return srvFindAllStoreByParent(branch.parent_store_id, 'store_code').then(stores => {
      return srvGetStockProductTradeIn(req.query, stores).then(rld => {
        res.xstatus(200).json({
          success: true,
          data: rld.rows,
          page: +req.query.page || 1,
          pageSize: +req.query.pageSize || 10,
          total: rld.count
        })
      }).catch(err => next(new ApiError(422, `ZMSTRDIN-00003: Couldn't find product trade in`, err)))
    }).catch(err => next(new ApiError(422, `ZMSTRDIN-00002: Couldn't find product trade in`, err)))
  }).catch(err => next(new ApiError(422, `ZMSTRDIN-00002: Couldn't find product trade in`, err)))
}

export function ctlGetStockProductSecond (req, res, next) {
  console.log('Requesting-ctlGetStockProductSecond: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  
  const userLogin = req.$userAuth
  return srvGetStoreBranch(userLogin.store).then(branch => {
    if(!branch) throw new Error('Branch is not initialized.')
    return srvFindAllStoreByParent(branch.parent_store_id, 'store_code').then(stores => {
      return srvGetStockProductSecond(req.query, stores).then(rld => {
        res.xstatus(200).json({
          success: true,
          data: rld.rows,
          page: +req.query.page || 1,
          pageSize: +req.query.pageSize || 10,
          total: rld.count
        })
      }).catch(err => next(new ApiError(422, `ZMSTRDIN-00003: Couldn't find product trade in`, err)))
    }).catch(err => next(new ApiError(422, `ZMSTRDIN-00002: Couldn't find product trade in`, err)))
  }).catch(err => next(new ApiError(422, `ZMSTRDIN-00002: Couldn't find product trade in`, err)))
}



export function ctlGetStockTradeInPerInvoices (req, res, next) {
  console.log('Requesting-ctlGetStockTradeInPerInvoices: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  
  return srvGetStockTradeInPerInvoices(req.body).then(trd => {
    res.xstatus(200).json({
      success: true,
      data: trd,
      total: trd.length
    })
  }).catch(err => next(new ApiError(422, `ZMSTRDIN-00015: Couldn't find product trade in`, err)))
}


export function ctlGetProductTradeIN (req, res, next) {
  console.log('Requesting-ctlGetProductTradeIN: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))

  const userLogin = req.$userAuth
  return srvGetStoreBranch(userLogin.store).then(store => {
    if(!store) throw new Error('Store branch is not defined.')
    return srvGetProductTradeIn(req.query, store.parent_store_code).then(rld => {
      res.xstatus(200).json({
        success: true,
        data: rld.rows,
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 10,
        total: rld.count
      })
    }).catch(err => next(new ApiError(422, `ZMSTRDIN-00002: Couldn't find product trade in`, err)))
  }).catch(err => next(new ApiError(422, `ZMSTRDIN-00002: Couldn't find product trade in`, err)))
}

export function ctlModifierProductTradeIN (req, res, next) {
  const userLogin = req.$userAuth
  let dataBody = req.body

  // const listStoreCode = Array.isArray(dataBody.listStore) ? dataBody.listStore : []

  return srvGetStoreBranch(dataBody.store).then(branchStore => {
    if(!branchStore) throw new Error('Store branch is not defined.')

    return srvFindOneStockByCode(dataBody.product).then(productExists => {
      if(!productExists) throw new Error(`Product ${dataBody.product} doesn\'t exists.`)

      return srvGetStoreByCode(branchStore.parent_store_code).then(storeExists => {
        // let unmatchStore = null

        let listRaw = [{
          product: productExists.id,
          store: storeExists.id,
          sell_price: dataBody.sell_price,
          status: dataBody.status
        }]

        // for(let k in listStoreCode) {
        //   const items = listStoreCode[k]
        //   const matchId = (storeExists.filter(x => x.storecode === items)[0] || {}).id

        //   if(!matchId) {
        //     unmatchStore = items
        //     break
        //   }

        //   listRaw.push()
        // }

        // if(unmatchStore) throw new Error(`Store ${unmatchStore} is not defined.`)

        return srvGetExistsTradeInByStoreProducts(listRaw).then(exists => {

          const listRawData = listRaw.map(a => {
            let tmpItem = a
            tmpItem.product_trd_id = (exists.filter(x => x.store_id === a.store && x.product_id === a.product)[0] || {}).product_trd_id

            return tmpItem
          })

          return srvModifierProductTradeIn(listRawData, userLogin.userid).then(result => {
            if(result.success) {
              res.xstatus(200).json({
                success: true,
                message: result.message
              })
            } else {
              throw new Error(result.message)
            }
          }).catch(err => next(new ApiError(422, `ZMSTRDIN-00006: Couldn't find product trade in`, err)))
        }).catch(err => next(new ApiError(422, `ZMSTRDIN-00005: Couldn't find product trade in`, err)))
      }).catch(err => next(new ApiError(422, `ZMSTRDIN-00004: Couldn't find product trade in`, err)))
    }).catch(err => next(new ApiError(422, `ZMSTRDIN-00004: Couldn't find product trade in`, err)))
  }).catch(err => next(new ApiError(422, `ZMSTRDIN-00003: Couldn't find product trade in`, err)))
}