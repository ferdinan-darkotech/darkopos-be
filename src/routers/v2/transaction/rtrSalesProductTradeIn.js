import express from 'express'
import { requireAuth } from '../../../services/v1/usersService'
import project from '../../../../config/project.config'
import {
  ctlCreateSalesProductTradeIn, ctlGetSalesProductTradeIn, ctlGetSalesProductTradeInDetail,
  ctlCancelSalesProductTradeIn
} from '../../../controllers/v2/transaction/ctlSalesProductTradeIn'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/transaction/sales/trade-in'
const apiRouter = [
  apiRoute + '/:store',
  apiRoute + '/:store/:trans'
]

router.get(apiRouter[0], requireAuth, ctlGetSalesProductTradeIn)
router.get(apiRouter[1], requireAuth, ctlGetSalesProductTradeInDetail)
router.post(apiRouter[0], requireAuth, ctlCreateSalesProductTradeIn)
router.put(apiRouter[1], requireAuth, ctlCancelSalesProductTradeIn)

export default router
