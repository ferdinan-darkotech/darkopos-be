/**
 * Created by p an da . has . my . id on 2018-03-13.
 */
import { ApiError } from '../../services/v1/errorHandlingService'
import { getReportPosTrans, getReportPurchaseTrans }
  from '../../services/dashboard/salesService'


// Retrieve Dashboard
exports.getDashboard = function (req, res, next) {
  console.log('Requesting-getDashboard: ' + req.url + ' ...')
  const SalesTrans = getReportPosTrans(req.query)
  const PurchaseTrans = getReportPurchaseTrans(req.query)
  return Promise.all([PurchaseTrans, SalesTrans]).then((data) => {
    const purchase = data[0]
    const sales = data[1]
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      sales,
      purchase
    })
  }).catch(err => next(new ApiError(422, `Couldn't find transaction`, err)))
}
