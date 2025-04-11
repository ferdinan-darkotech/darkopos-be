import moment from 'moment'
import {
  srvGetListPurchaseDetail, srvGetListPurchaseDetailBySupplier, srvGetAllPurchaseDetailByCondition,
  srvGetTransitData, srvReceiveStockPurchase
} from '../../../services/v2/transaction/srvPurchases'
import { extractTokenProfile } from '../../../services/v1/securityService'
import { ApiError } from '../../../services/v1/errorHandlingService'



export function ctlGetAllPurchaseDetailByCondition (req, res, next) {
  console.log('Requesting-ctlGetAllPurchaseDetailByCondition: ' + req.url + ' ...')
  return srvGetAllPurchaseDetailByCondition(req.body).then(data => {
    res.xstatus(200).json({
      success: true,
      data: data,
      total: data.length,
    })
  }).catch(err => next(new ApiError(422, `ZPURC-0000: Couldn't get data purchase detail.`, err)))
}

export function ctlGetListPurchaseDetail (req, res, next) {
  console.log('Requesting-ctlGetListPurchaseDetail: ' + req.url + ' ...')
  return srvGetListPurchaseDetail(req.query).then(data => {
    res.xstatus(200).json({
      success: true,
      data: data.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 25,
      total: data.count,
    })
  }).catch(err => next(new ApiError(422, `ZPURC-0001: Couldn't get data purchase detail.`, err)))
}

export function ctlGetListPurchaseDetailBySupplier (req, res, next) {
  console.log('Requesting-ctlGetListPurchaseDetailBySupplier: ' + req.url + ' ...')
  return srvGetListPurchaseDetailBySupplier(req.query).then(data => {
    res.xstatus(200).json({
      success: true,
      data: data.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 25,
      total: data.count,
    })
  }).catch(err => next(new ApiError(422, `ZPURC-0002: Couldn't get data purchase detail.`, err)))
}

export function ctlGetTransitData (req, res, next) {
  console.log('Requesting-ctlGetTransitData: ' + req.url + ' ...')
  return srvGetTransitData(req.query).then(dataTransit => {
      res.xstatus(200).json({
          success: true,
          data: dataTransit
      })
  }).catch(err => next(new ApiError(422, `ZPURC-0003: Couldn't get data purchase transit.`, err)))
}



export function ctlReceiveStock (req, res, next) {
  console.log('Requesting-ctlReceiveStock: ' + req.url + ' ...')
  const userLogIn = extractTokenProfile(req)
  return srvReceiveStockPurchase(req.body, userLogIn.userid).then(rcv => {
      res.xstatus(200).json({
          success: true,
          message: `Transaction ${req.body.transno} has been received`
      })
  }).catch(err => next(new ApiError(422, `ZPURC-0004: Couldn't receive purchase.`, err)))
}