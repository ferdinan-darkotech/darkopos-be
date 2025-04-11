import { ApiError } from '../../services/v1/errorHandlingService'
import { getTransByNo6, getTransByNoSaldoAwal } from '../../services/Report/payableReportService'

// Get Payment By TransNo
exports.getTransByNoWithBank = function (req, res, next) {
  console.log('Requesting-PayableTrans: ' + JSON.stringify(req.params) + ' ...')
  getTransByNo6(req.query).then((Payment) => {
    return getTransByNoSaldoAwal(req.query).then((Data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        icode: 'PYB-01',
        total: (Payment || []).length + (Data || []).length,
        data: (Data || []).length ? Data.concat(Payment) : Payment
      })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
}