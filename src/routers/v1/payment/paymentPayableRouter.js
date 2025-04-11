import express from 'express'
import project from '../../../../config/project.config'
import {
  requireAuth
} from '../../../services/v1/usersService'
import {
  getTransBySplit,
  getTransByNo,
  // getTransByNoWithPOS,
  getTransByNoWithBank,
  getPurchaseByNo,
  insertPayment,
  insertBulkPayment,
  cancelPayment
}
  from '../../../controllers/payment/paymentPayableController'

const router = express.Router()

const apiRoute = project.api_prefix + '/payment/payable'
const apiRouter = [
  apiRoute, // 0
  apiRoute + '/purchase', // 1
  apiRoute + '/cancel', // 2
  apiRoute + '/some', // 3
  apiRoute + '/report/purchase', // 4
  // apiRoute + '/report/pos', // 5
]

// MAIN //
router.get(apiRouter[0], requireAuth, getTransByNo)
router.get(apiRouter[3], requireAuth, getTransBySplit)
router.get(apiRouter[1], requireAuth, getPurchaseByNo)
// router.get(apiRouter[5], requireAuth, getTransByNoWithPOS)
router.get(apiRouter[4], requireAuth, getTransByNoWithBank)
router.post(apiRouter[0], requireAuth, insertPayment)
router.post(apiRouter[3], requireAuth, insertBulkPayment)
router.put(apiRouter[2], requireAuth, cancelPayment)
// MAIN //

export default router