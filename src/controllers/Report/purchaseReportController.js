/**
 * Created by Veirry on 15/09/2017.
 */
import { ApiError} from '../../services/v1/errorHandlingService'
import {
  getReportPurchaseTrans, getDailyPurchase, srvGetReportTransit
} from '../../services/Report/purchaseReportService'
import { extractTokenProfile } from '../../services/v1/securityService'

exports.getPurchaseReportTrans = function (req, res, next) {
  console.log('Requesting-getPurchaseReportTrans: ' + req.url + ' ...')
  let { from, to, ...other } = req.query
  console.log('req.query', req.query)
  getReportPurchaseTrans(req.query).then((pos) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      icode: 'PURC-01',
      total: pos.length,
      data: JSON.parse(JSON.stringify(pos)),
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Purchase Report.`, err)))
}

exports.getPurchaseReportDaily = function (req, res, next) {
  console.log('Requesting-getPurchaseReportDaily: ' + req.url + ' ...')
  const userid = req.params.id
  getDailyPurchase(req.query).then((purch) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      icode: 'PURC-02',
      total: purch.length,
      data: purch
    })
  }).catch(err => next(new ApiError(501, ` - Couldn't find Purchase Report.`, err)))
}

exports.ctlGetReportTransit = function (req, res, next) {
  console.log('Requesting-ctlGetReportTransit: ' + req.url + ' ...')
  const userLogin = extractTokenProfile(req)
  return srvGetReportTransit(req.params.type, userLogin.userid, req.query).then((purch) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      icode: 'PURC-02',
      total: (purch.data || []).length,
      data: purch.data
    })
  }).catch(err => next(new ApiError(501, ` - Couldn't find Purchase Report.`, err)))
}