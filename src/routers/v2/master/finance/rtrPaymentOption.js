import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  getPaymentOptions,
  getPaymentOptionByCode,
  insertPaymentOption,
  updatePaymentOption,
  deletePaymentOption
} from '../../../../controllers/v2/master/finance/ctlPaymentOption'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/payment'
const apiRouter = [
  apiRoute + '/options',
  apiRoute + '/options/:code'
]

// MAIN //
router.get(apiRouter[0], requireAuth, getPaymentOptions)
router.get(apiRouter[1], requireAuth, getPaymentOptionByCode)
router.post(apiRouter[0], requireAuth, insertPaymentOption)
router.put(apiRouter[1], requireAuth, updatePaymentOption)
router.delete(apiRouter[1], requireAuth, deletePaymentOption)
// MAIN //

export default router