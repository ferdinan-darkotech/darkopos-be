import express from 'express'
import { requireAuth } from '../../../services/v1/usersService'
import project from '../../../../config/project.config'
import {
  ctlGetListPurchaseDetail, ctlGetListPurchaseDetailBySupplier, ctlReceiveStock, ctlGetTransitData,
  ctlGetAllPurchaseDetailByCondition
} from '../../../controllers/v2/transaction/ctlPurchases'
import {  } from '../../../controllers/purchaseController'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/purchase'

const apiRouter = [
  apiRoute,
  apiRoute + '/detail',
  apiRoute + '/detail/supplier',
  apiRoute + '/receive-stock',
  apiRoute + '/intransit'
]

router.post(apiRouter[1], requireAuth, ctlGetAllPurchaseDetailByCondition)
router.get(apiRouter[1], requireAuth, ctlGetListPurchaseDetail)
router.get(apiRouter[2], requireAuth, ctlGetListPurchaseDetailBySupplier)
router.get(apiRouter[4], requireAuth, ctlGetTransitData)
router.put(apiRouter[3], requireAuth, ctlReceiveStock)

export default router
