import express from 'express'
import project from '../../../../config/project.config'
import {
  requireAuth
} from '../../../services/v1/usersService'
import {
  getPaymentOption,
  insertPaymentOption,
  updatePaymentOption,
  deletePaymentOption
} from '../../../controllers/payment/paymentOption'

const router = express.Router()

const apiRoute = project.api_prefix + '/payment'
const apiRouter = [
  apiRoute + '/option',
  apiRoute + '/option/:id'
]

// MAIN //
router.get(apiRouter[0], requireAuth, getPaymentOption)
router.post(apiRouter[0], requireAuth, insertPaymentOption)
router.put(apiRouter[1], requireAuth, updatePaymentOption)
router.delete(apiRouter[0], requireAuth, deletePaymentOption)
// MAIN //

export default router