import { ApiError } from '../../../services/v1/errorHandlingService'
import * as srv from '../../../services/v2/transaction/srvSales'

import { srvGetSaleByStoreOneDay, srvGetSaleByStoreTransNo } from '../../../services/v2/sales/srvSaleHead'
import { srvGetSaleDetailByStoreTransNo } from '../../../services/v2/sales/srvSaleDetail'
import { srvGetSalePaymentByStoreTransNo } from '../../../services/v2/sales/srvSalePayment'
import { srvGetAllStockProductTradeIn } from '../../../services/v2/master/stocks/srvProductTradeIN'
import { srvGetOneCustomerByCode } from '../../../services/v2/master/customer/srvCustomerList'


export function ctlGetPendingTaxSeries (req, res, next) {
  const { store } = req.$userAuth
  return srv.srvGetPendingTaxSeries(store).then(rs => {
		res.xstatus(200).json({
			success: true,
			data: rs,
			total: rs.length
		})
	}).catch(err => next(new ApiError(422, `ZQV2-SALES01: Couldn't get invoices`, err)))
}

export function ctlRegenerateTaxSeries (req, res, next) {
  const { store } = req.$userAuth
  return srv.srvRegenerateTaxSeries(store, req.params.invoice).then(rs => {
		res.xstatus(200).json({
			success: true,
			message: 'Tax series has been generate.'
		})
	}).catch(err => next(new ApiError(422, `Tax series is not exists.`)))
}


export function ctlGetSaleByStoreTransNo (req, res, next) {
  console.log('Requesting-getSaleByStoreTransNo: ' + JSON.stringify(req.params) + ' ...')
  let { pageSize, page, ...other } = req.query
  let { store, transNo } = req.params

  let mode = []
  if (other && other.hasOwnProperty('m')) {
    mode = other.m.split(',')
  }

  let prmsUnion, prmsSaleHead, prmsSaleDetail, prmsSalePayment, custInfo

  prmsSaleHead = srvGetSaleByStoreTransNo(store, transNo, req.query)
  if (mode.includes('ext1')) prmsSaleDetail = srvGetSaleDetailByStoreTransNo(store, transNo, { m: 'bf'})
  if (mode.includes('ext2')) prmsSalePayment = srvGetSalePaymentByStoreTransNo(store, transNo, { m: 'bf'})
  prmsUnion = prmsSaleHead

  let prmsAll = Promise.all([prmsSaleHead, prmsSaleDetail, prmsSalePayment])

  prmsAll.then(async (values) => {
    let detail = (values[1]) ? values[1] : []
    let newDetailSales = [...detail]

    const listTradeIn = detail.map(x => x.trade_in_id)
    
    if(listTradeIn.length > 0) {
      const tradeIn = await srvGetAllStockProductTradeIn(transNo, listTradeIn)
      const tmpDetailSales = JSON.parse(JSON.stringify(detail)).map(a => {
        let { trade_in_id, ...items } = a
        items.trade_in = tradeIn.filter(b => trade_in_id === b.ref_id).map(x => ({
          product_code: x.product_code,
          product_name: x.product_name,
          qty: x.qty,
          price: x.price,
          disc_n: x.disc_n,
          disc_p: x.disc_p,
          conditions: x.conditions
        }))
        return items
      })
      newDetailSales = tmpDetailSales
    }
    
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: values[0].count,
      data: values[0],
      detail: newDetailSales,
      edc: values[2]
    })
  }).catch(err => next(new ApiError(422,`ZCSP-00001: Couldn't find Sale`, err)))
}

// [POS SALES ONE DAY]: FERDINAN - 2025-04-24
export function ctlGetSaleByStoreInOneDay (req, res, next) {
  console.log('Requesting-getSaleByStoreInOneDay: ' + JSON.stringify(req.params) + ' ...')
  let { store } = req.params

  srvGetSaleByStoreOneDay(store, req.query.date).then(rs => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: rs
    })
  }).catch(err => next(new ApiError(422,`ZCSP-00001: Couldn't find Sale`, err)))
}