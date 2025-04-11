import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlCloseCashPeriod, ctlCreateCashBalance, ctlGetActivePeriod, ctlGetEndBalance
} from '../../../controllers/v2/finance/ctlCashierBalance'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/finance/cash-period'
const apiRouter = [
  apiRoute + '/:trans',
  apiRoute + '/:trans/balance'
]

// MAIN //
router.get(apiRouter[0], requireAuth, ctlGetActivePeriod)
router.put(apiRouter[0], requireAuth, ctlCloseCashPeriod)
router.get(apiRouter[1], requireAuth, ctlGetEndBalance)
router.post(apiRouter[1], requireAuth, ctlCreateCashBalance)
// MAIN //

export default router