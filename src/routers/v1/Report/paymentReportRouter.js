import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getTransByNoWithPOS, getPaymentAR, getPaymentARGroup } from '../../../controllers/Report/paymentReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/payment'
const apiRouter = [
  apiRoute, // 0
  apiRoute + '/report/pos', // 1
  apiRoute + '/report/ar/time', // 2
  apiRoute + '/report/ar/group', // 3
]

// MAIN //
router.get(apiRouter[1], requireAuth, getTransByNoWithPOS)
router.get(apiRouter[2], requireAuth, getPaymentAR)
router.get(apiRouter[3], requireAuth, getPaymentARGroup)
// MAIN //

export default router