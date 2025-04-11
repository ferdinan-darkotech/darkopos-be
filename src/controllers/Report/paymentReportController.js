import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { getTransByNo6, getTransByNo5, getPaymentReportAR, getPaymentReportARGroup } from '../../services/Report/paymentReportService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Get Payment By TransNo
exports.getTransByNoWithPOS = function (req, res, next) {
  console.log('Requesting-getTransByNoWithPOS3: ' + JSON.stringify(req.params) + ' ...')
  getTransByNo5(req.query).then((Payment) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      icode: 'PMT-01',
      total: (Payment || []).length,
      data: Payment
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
}

// Get Payment For AR
exports.getPaymentAR = function (req, res, next) {
  console.log('Requesting-getPaymentAR: ' + JSON.stringify(req.params) + ' ...')
  getPaymentReportAR(req.query).then((Payment) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      icode: 'PMT-02',
      total: (Payment || []).length,
      data: Payment
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
}

// Get Payment For AR
exports.getPaymentARGroup = function (req, res, next) {
  console.log('Requesting-getPaymentARGroup: ' + JSON.stringify(req.params) + ' ...')
  getTransByNo6(req.query).then((Payment) => {
    return getPaymentReportARGroup(req.query).then((Data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        icode: 'PMT-03',
        total: (Payment || []).length + (Data || []).length,
        data: (Data || []).length ? Data.concat(Payment) : Payment
      })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
}
