import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import {
  getPos, getAllPos, insertPos, updatePos, deletePos,
  deletePoses, getLast, cancelPos, confirmPayments,
  confirmTapIn
}
from '../../controllers/posController'

import {
  ctlGetListQueue, ctlInsertQueueSales, ctlUpdateQueueSales, ctlGetDataQueue, ctlDeleteQueue,
  ctlGetListQueueApproval, ctlUpdateApprovalQueueProduct, ctlValidationSales, ctlGetHistoryWO,
  ctlGetVoidWO, ctlResendConfirmationOrder, ctlDeletePendingWO, ctlSetLocationCustomers,
  ctlValidationHPP
} from '../../controllers/v2/transaction/ctlQueueSales'

const router = express.Router()

const apiRoute = project.api_prefix + '/pos'
const apiRoute1 = project.api_prefix + '/pos/:last'
const apiRoute2 = project.api_prefix_v2 + '/pos/queue'
const apiRoute3 = project.api_prefix_v2 + '/pos/confirm'
const apiRouter = [
  apiRoute,
  apiRoute + '/code' + '/:id',
  apiRoute1,
]

const apiRouteQueue = [
  apiRoute2,
  apiRoute2 + '/:store',
  apiRoute2 + '/:store/:header',
  apiRoute2 + '/approval',
  apiRoute2 + '/validation-sales',
  apiRoute2 + '/history-wo',
  apiRoute2 + '/cancel-queue',
  apiRoute2 + '/validation/hpp'
]

const apiRouteConfirm = [
  apiRoute3 + '/payment/:type',
  apiRoute3 + '/tap-in/mechanic/:type',
  apiRoute3 + '/pending-wo/:recordID',
  apiRoute3 + '/set-location/customers'
]

// MAIN //
// Begin Queue Sales
router.get(apiRouteQueue[3], requireAuth, ctlGetListQueueApproval)
router.put(apiRouteQueue[3], requireAuth, ctlUpdateApprovalQueueProduct)
router.post(apiRouteQueue[4], requireAuth, ctlValidationSales)
router.get(apiRouteQueue[5], requireAuth, ctlGetHistoryWO)
router.get(apiRouteQueue[6], requireAuth, ctlGetVoidWO)
router.get(apiRouteQueue[1], requireAuth, ctlGetListQueue)
router.post(apiRouteQueue[1], requireAuth, ctlInsertQueueSales)
router.get(apiRouteQueue[2], requireAuth, ctlGetDataQueue)
router.put(apiRouteQueue[2], requireAuth, ctlUpdateQueueSales)
router.delete(apiRouteQueue[2], requireAuth, ctlDeleteQueue)

// [HPP VALIDATION]: FERDINAN  - 20250522
router.post(apiRouteQueue[7], requireAuth, ctlValidationHPP)
// End Queue Sales


router.get(apiRouter[1], requireAuth, getPos)

router.get(apiRouter[0], requireAuth, getAllPos)

router.get(apiRouter[2], requireAuth, getLast)

router.post(apiRouter[1], requireAuth, insertPos)

router.put(apiRouter[0], requireAuth, updatePos)

router.put(apiRouter[1], requireAuth, cancelPos)

router.delete(apiRouter[1], requireAuth, deletePos)

router.delete(apiRouter[0], requireAuth, deletePoses)

// Confirm Flow Sales
router.post(apiRouteConfirm[0], requireAuth, confirmPayments)
router.post(apiRouteConfirm[1], requireAuth, confirmTapIn)
router.post(apiRouteConfirm[2], requireAuth, ctlResendConfirmationOrder)
router.delete(apiRouteConfirm[2], requireAuth, ctlDeletePendingWO)
router.post(apiRouteConfirm[3], requireAuth, ctlSetLocationCustomers)




// MAIN //

export default router
