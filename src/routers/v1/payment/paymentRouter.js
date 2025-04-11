import express from 'express'
import project from '../../../../config/project.config'
import {
  requireAuth
} from '../../../services/v1/usersService'
import {
  getTransBySplit,
  getTransByNo,
  // getTransByNoWithPOS,
  getPosByNo,
  insertPayment,
  insertBulkPayment,
  cancelPayment
}
  from '../../../controllers/payment/paymentController'

const router = express.Router()

const apiRoute = project.api_prefix + '/payment'
const apiRouter = [
  apiRoute, // 0
  apiRoute + '/pos', // 1
  apiRoute + '/cancel', // 2
  apiRoute + '/some', // 3
  // apiRoute + '/report/pos', // 4
]

// MAIN //
router.get(apiRouter[0], requireAuth, getTransByNo)
router.get(apiRouter[3], requireAuth, getTransBySplit)
router.get(apiRouter[1], requireAuth, getPosByNo)
// router.get(apiRouter[4], requireAuth, getTransByNoWithPOS)
router.post(apiRouter[0], requireAuth, insertPayment)
router.post(apiRouter[3], requireAuth, insertBulkPayment)
router.put(apiRouter[2], requireAuth, cancelPayment)
// MAIN //

export default router