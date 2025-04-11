/**
 * Created by  pa nda .ha s . my .id on 2018-06-21.
 */
import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../services/v1/securityService'
import {
  srvCashierTransSourceQuery
} from '../../services/cashier/transactionsService'

// Retrieve a cashier transaction
exports.getCashierTransactionSourceAll = function (req, res, next) {
  console.log('Requesting-getCashierTransactionSourceAll: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  let mode = 'alltrans'
  if (other) {
    if (other.hasOwnProperty('transType')) mode = 'pertrans'
  }
  srvCashierTransSourceQuery(req.params, req.query, mode).then((cashier) => {
    let total = {}, dataPromise = []
    if (cashier) {
      if (mode === 'pertrans') {
        total = srvCashierTransSourceQuery(req.params, req.query, 'pertranssum')
      } else if (mode === 'alltrans') {
        total = srvCashierTransSourceQuery(req.params, req.query, 'alltranssum')
      }
    }
    dataPromise = [cashier, total]
    Promise.all(dataPromise).then((values) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        length: cashier.length,
        data: { total: values[1], detail: values[0] }
      })
    })
  }).catch(err => next(new ApiError(404, `ZCTC-00001: Couldn't find Transaction for User ${req.params.id}.`, err)))
}

