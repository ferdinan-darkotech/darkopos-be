import {
  srvCreateRequestOrder, srvUpdateRequestOrder, srvGetRequestOrderHeader, srvGetRequestOrderCategory,
  srvGetRequestOrderDetailByTransNo, srvTransExist, srvGetSomeRequestOrderDetail, srvVoidOrder
} from '../../../services/v2/inventory/srvRequestOrder'
import { srvGetStoreById } from '../../../services/setting/storeService'
import { srvGetLookupByGroupCode } from '../../../services/v2/setting/srvLookup'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'
import { srvGetSomeStockOnHand } from '../../../services/v2/inventory/srvStocks'
import { getSequenceFormatByCode } from '../../../services/sequenceService'


export function ctlGetRequestOrderHeader (req, res, next) {
  console.log('Requesting-ctlGetRequestOrderHeader: ' + JSON.stringify(req.params) + ' ...')
  req.query.storeid = req.params.store || 'No Store'
  return srvGetRequestOrderHeader(req.query).then(header => {
    res.xstatus(200).json({
      success: true,
      data: header.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: header.count,
    })
  }).catch(err => next(new ApiError(422, `ZSRO-00006: Couldn't find order`, err)))
}

export function ctlGetRequestOrderDetail (req, res, next) {
  console.log('Requesting-ctlGetRequestOrderDetail: ' + JSON.stringify(req.params) + ' ...')
  const transno = req.params.trans
  const storeid = req.params.store || 'No Store'
  return srvGetRequestOrderDetailByTransNo(storeid, transno).then(detail => {
    res.xstatus(200).json({
      success: true,
      data: detail,
      length: detail.length
    })
  }).catch(err => next(new ApiError(422, `ZSRO-00007: Couldn't find order`, err)))
}

export function ctlGetSomeRequestOrderDetail (req, res, next) {
  console.log('Requesting-ctlGetSomeRequestOrderDetail: ' + JSON.stringify(req.params) + ' ...')
  const storeid = req.params.store || 'No Store'
  return srvGetSomeRequestOrderDetail(req.query, storeid).then(detail => {
    res.xstatus(200).json({
      success: true,
      data: detail,
      length: detail.length
    })
  }).catch(err => next(new ApiError(422, `ZSRO-00010: Couldn't find order`, err)))
}

export function ctlGetRequestOrderCategory (req, res, next) {
  return srvGetRequestOrderCategory().then(category => {
    res.xstatus(200).json({
      success: true,
      data: category
    })
  }).catch(err => next(new ApiError(422, `ZSRO-00008: Couldn't find order`, err)))
}

export async function ctlCreateRequestOrder (req, res, next) {
  console.log('Requesting-ctlCreateRequestOrder: ' + JSON.stringify(req.params) + ' ...')
  const userLogin = extractTokenProfile(req)
  let { detail, ...data } = req.body
  const transno = await getSequenceFormatByCode({ seqCode: 'RO', type: data.storeid }, next)
  if(!transno) {
    throw new Error('Cannot Find Sequence')
  } else {
    data.transno = transno
    data.user = userLogin.userid
    const productCode = detail.map(i => i.productcode)
    return srvGetSomeStockOnHand(productCode, data.storeid).then(async prod => {
      const storeReceive = await srvGetStoreById(data.storeidreceiver)
      const storeSender = await srvGetStoreById(data.storeid)
      const lookup = await srvGetLookupByGroupCode('DOC-TITLE', 'STOCK-REQUEST-ORDERS')
      let toReturn = {
        ...data,
        detail: [],
        storename: storeSender.storeName,
        storenamereceiver: storeReceive.storeName,
        createdby: userLogin.userid
      }
      if (prod.length === 0 || prod.length !== productCode.length) throw new Error('Some product not found')
      const listDetail = prod.map(item => {
        const { productid, productcode, productname } = item
        const inputProduct = detail.filter(i => i.productcode === productcode)[0]
        
        toReturn.detail.push({ ...inputProduct, productcode, productname })
        return { ...inputProduct, productid, productcode, transno, storeid: data.storeid, user: userLogin.userid }
      })
      data.detail = listDetail
      return srvCreateRequestOrder(data).then(result => {
        if(!result.success) throw new Error(result.message)
        res.xstatus(200).json({
          success: true,
          message: `Request order has been created by transno ${transno}`,
          data: { ...toReturn, title: { name: lookup.lookupname, value: lookup.value1 } }
        })
      }).catch(err => next(new ApiError(422, `ZSRO-00002: Couldn't create order`, err)))
    }).catch(err => next(new ApiError(422, `ZSRO-00001: Couldn't create order`, err)))
  }
}

export async function ctlUpdateRequestOrder (req, res, next) {
  console.log('Requesting-ctlUpdateRequestOrder: ' + JSON.stringify(req.params) + ' ...')
  const userLogin = extractTokenProfile(req)
  let { addItem, editItem, deleteItem, ...data } = req.body
  const transno = req.params.trans
  const storeid = +req.params.store
  data.storeid = storeid
  data.transno = transno
  data.user = userLogin.userid
  const productCode = addItem.map(i => i.productcode)  
  return srvTransExist(transno).then(exist => {
    if(!exist) throw new Error('No trans not found')
    return srvGetRequestOrderDetailByTransNo(storeid, transno).then(async detailTrans => {
      let duplicateItem = true
      let detailAdd = []
      let detailEdit = []
      let detailDelete = []
      detailTrans.map(items => {
        const { productcode, productid, id } = items
        const tmpAddItem = addItem.filter(i => i.productcode === productcode)[0]
        const tmpEditItem = editItem.filter(i => i.productcode === productcode)[0]
        const tmpDeleteItem = deleteItem.filter(i => i.productcode === productcode)[0]
        if(tmpAddItem) {
          duplicateItem = false
          throw new Error('Data cannot be duplicate')
        } else {
          if(tmpEditItem) detailEdit.push({ ...tmpEditItem, id: +id, user: userLogin.userid })
          else if(tmpDeleteItem) detailDelete.push({ ...tmpDeleteItem, id: +id, user: userLogin.userid })
        }
      })
      // get product from add item
      if(duplicateItem && addItem.length !== 0) {
        const prod = await srvGetSomeStockOnHand(productCode, storeid)
        if (prod.length === 0 || prod.length !== productCode.length) throw new Error('Some product can\'t be found')
        prod.map(item => {
          const { productid, productcode } = item
          const inputProduct = addItem.filter(i => i.productcode === productcode)[0]
          detailAdd.push({...inputProduct, productid, productcode, transno, storeid, user: userLogin.userid })
        })
      }
      const packData = {
        ...data,
        detailAdd,
        detailDelete,
        detailEdit
      }
      
      // res.xstatus(200).json({ packData })
      return srvUpdateRequestOrder(packData).then(result => {
        if(!result.success) throw new Error(result.message)
        res.xstatus(200).json({
          success: true,
          message: `Request order has been updated by transno ${transno}`
        })
      }).catch(err => next(new ApiError(422, `ZSRO-00005: Couldn't update order`, err)))
    }).catch(err => next(new ApiError(422, `ZSRO-00004: Couldn't update order`, err)))
  }).catch(err => next(new ApiError(422, `ZSRO-00003: Couldn't update order`, err)))
}

export function ctlVoidOrder (req, res, next) {
  console.log('Requesting-ctlVoidOrder: ' + JSON.stringify(req.params) + ' ...')
  const storeid = +req.params.store
  const profile = extractTokenProfile(req)
  const data = { ...req.body, statusby: profile.userid }
  const voidText = data.statuscode === 'C' ? 'Close' : 'Reject'
  return srvGetRequestOrderDetailByTransNo(storeid, data.transno, data.statuscode === 'C' ? 'IN' : 'OUT').then(detail => {
    const getProduct = (detail || []).filter(x => x.productcode === data.productcode)[0]
    let checkCondition = false
    if(data.statuscode !== 'R' && data.statuscode !== 'C') throw new Error('Wrong status code ..')
    if(!getProduct) {
      throw new Error('Product undefined ...')
    } else {
      if(getProduct.statuscode !== 'A') throw new Error(`Data has been ${voidText}`)
      const condition01 = (+getProduct.storeid === storeid && data.statuscode === 'C')
      const condition02 = (+getProduct.storeidreceiver === storeid && data.statuscode === 'R')
      if(condition01 || condition02) checkCondition = true
    }
    if(checkCondition) {
      return srvVoidOrder(data).then(updated => {
        res.xstatus(200).json({
          success: true,
          message: `Data ${data.transno} has been ${voidText}`
        })
      }).catch(err => next(new ApiError(422, `ZSRO-00012: Couldn't ${voidText} order`, err)))
    } else {
      throw new Error('Wrong status code ...')
    }
  }).catch(err => next(new ApiError(422, `ZSRO-00011: Couldn't ${voidText} order`, err)))
}