// [NEW]: FERDINAN - 2025-03-06
import express from 'express'
import { requireAuth } from '../../../services/v1/usersService'
import project from '../../../../config/project.config'
import * as ctl from '../../../controllers/requestStockOutController'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/request-stock-out'

const apiRouter = [
  apiRoute + '/',
  apiRoute + '/:id',
  apiRoute + '/:id/queue',
  apiRoute + '/:id/cancel',

  // [ACCEPT REQUEST STOCK OUT REPORT]: FERDINAN - 2025/06/30
  apiRoute + '/report/finish',
  apiRoute + '/report/all'
]


router.get(apiRouter[0], requireAuth, ctl.getRequestStockOut)
router.get(apiRouter[1], requireAuth, ctl.getRequestStockOutDetail)
router.get(apiRouter[2], requireAuth, ctl.getTransactionRequestStockOut)

router.post(apiRouter[0], requireAuth, ctl.createRequestStockOut)
router.put(apiRouter[1], requireAuth, ctl.updateRequestStockOut)
router.put(apiRouter[3], requireAuth, ctl.updateStatusCancelRequestStockOut)
router.delete(apiRouter[1], requireAuth, ctl.deleteRequestStockOut)

// [ACCEPT REQUEST STOCK OUT REPORT]: FERDINAN - 2025/06/30
router.get(apiRouter[4], requireAuth, ctl.getFinishRequestStockOut)
router.get(apiRouter[5], requireAuth, ctl.getAllRequestStockOutPerReq)


export default router
