import {
  srvCancelSalesProductTradeIn, srvCheckExistSalesProductTradeIn, srvCreateSalesProductTradeIn,
  srvGetSalesProductTradeIn, srvGetSalesProductTradeInDetail
} from '../../../services/v2/transaction/srvSalesProductTradeIn'
import { srvGetExistingStockProductTradeInById } from '../../../services/v2/master/stocks/srvProductTradeIN'
import { srvGetStoreBranchSetting, srvGetExistingStoreByCode } from '../../../services/v2/master/store/srvStore'
import { srvGetVendorByCode } from '../../../services/v2/master/general/srvVendor'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetEmployeeByCode } from '../../../services/v2/master/humanresource/srvEmployee'
import { extractTokenProfile } from '../../../services/v1/securityService'
import moment from 'moment'

export function ctlGetSalesProductTradeIn(req, res, next) {
  console.log('Requesting-ctlGetSalesProductTradeIn: ' + req.url + ' ...')
  return srvGetSalesProductTradeIn({ store: req.params.store, ...req.query }).then(items => {
    res.xstatus(200).json({
      success: true,
      data: items.rows,
      total: items.count,
      page: (req.query.page || 1),
      pageSize: (req.query.pageSize || 25)
    })   
  }).catch(er => next(new ApiError(422, `ZSLSPTIN-0001: Couldn't find product trade-in.`, er)))
}

export function ctlGetSalesProductTradeInDetail(req, res, next) {
  console.log('Requesting-ctlGetSalesProductTradeInDetail: ' + req.url + ' ...')

  const parStore = req.params.store
  const parTrans = req.params.trans

  return srvGetSalesProductTradeInDetail(parStore, parTrans, 'bf').then(items => {
    res.xstatus(200).json({
      success: true,
      data: items,
      total: items.length
    })   
  }).catch(er => next(new ApiError(422, `ZSLSPTIN-0002: Couldn't find product trade-in.`, er)))
}


export function ctlCreateSalesProductTradeIn (req, res, next) {
  console.log('Requesting-ctlCreateSalesProductTradeIn: ' + req.url + ' ...')
  const { details, ...other } = req.body
  const userLogin = extractTokenProfile(req)

  const storeCode = req.params.store
  const listProductTradeIn = details.map(x => x.stock_id)
    
  return srvGetStoreBranchSetting(userLogin.store).then(async settingStoreBranch => {
    const tradeInSetting = ((settingStoreBranch.settingparent || {}).productTradeIn || {})
    const taxes = ((settingStoreBranch.settingparent || {}).salesTax || {})
    
    if(tradeInSetting.active.toString() !== 'true') throw new Error("This transaction is disabled, call the IT Support.")
    
    // const stores = await srvGetExistingStoreByCode(storeCode)
    const vendors = await srvGetVendorByCode(other.vendor)
    const existsPIC = await srvGetEmployeeByCode(other.pic)

    if(!vendors) throw new Error('Information vendor is not defined.')
    else if(!existsPIC) throw new Error('Information PIC is not defined.')

    return srvGetExistingStockProductTradeInById(listProductTradeIn).then(stocks => {
      let newStockTradeIn = []
      let unknownStocks = null

      for(let x in details) {
        const items = details[x]
        const matchStock = stocks.filter(a => a.stock_buy_id === items.stock_id)[0]

        if(!matchStock) {
          unknownStocks = 'Some qty of product trade-in is not enough.'
          break
        }

        newStockTradeIn.push({
          buy_date: moment(matchStock.created_at).format('YYYY-MM-DD'),
          sales_no: matchStock.sales_no,
          product_src_id: matchStock.stock_buy_id,
          store_src_id: matchStock.store_id,
          product_id: matchStock.product_id,
          qty: matchStock.qty,
          weight: items.weight,
          price: items.price,
          disc_p: (items.disc_p || 0),
          disc_n: (items.disc_n || 0)
        })
      }

      if(typeof unknownStocks === 'string') throw new Error(unknownStocks)

      const info = {
        users: userLogin.userid,
        times: moment(),
        store: userLogin.store
      }

      const newPayloads = {
        ...other,
        vendor_id: vendors.vendor_id,
        pic_id: existsPIC.id,
        trans_date: moment(info.times).format('YYYY-MM-DD'),
        details: newStockTradeIn
      }
      
      return srvCreateSalesProductTradeIn(newPayloads, info, tradeInSetting.automate, taxes).then(results => {
        res.xstatus(200).json({
          success: true,
          message: results.message,
          data: {
            trans_no: results.trans_no
          }
        })
      }).catch(er => next(new ApiError(422, `ZSLSPTIN-0005: Couldn't find product trade-in.`, er)))      
    }).catch(er => next(new ApiError(422, `ZSLSPTIN-0004: Couldn't find product trade-in.`, er)))
  }).catch(er => next(new ApiError(422, `ZSLSPTIN-0003: Couldn't find product trade-in.`, er)))
}


export function ctlCancelSalesProductTradeIn(req, res, next) {
  console.log('Requesting-ctlCancelSalesProductTradeIn: ' + req.url + ' ...')
  
  const userLogin = extractTokenProfile(req)

  const parStore = req.params.store
  const parTrans = req.params.trans

  return srvGetExistingStoreByCode(parStore).then(exists => {
    if(!exists) throw new Error('Data store is not found.')


    return srvCheckExistSalesProductTradeIn(parTrans, exists.id).then(items => {
      if(!items) throw new Error('Transaction is not found.')

      const info = {
        users: userLogin.userid,
        times: moment()
      }

      return srvCancelSalesProductTradeIn(exists.id, parTrans, info).then(canceled => {
        res.xstatus(200).json({
          success: true,
          message: `Transaction ${items.trans_no} has been canceled.`,
          data: {
            trans_no: items.trans_no
          }
        })
      }).catch(er => next(new ApiError(422, `ZSLSPTIN-0007: Couldn't find product trade-in.`, er)))
    }).catch(er => next(new ApiError(422, `ZSLSPTIN-0007: Couldn't find product trade-in.`, er)))
  }).catch(er => next(new ApiError(422, `ZSLSPTIN-0006: Couldn't find product trade-in.`, er)))
  
  
}