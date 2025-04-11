import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlGetRequestOrderCategory, ctlGetRequestOrderDetail, ctlCreateRequestOrder,
  ctlGetRequestOrderHeader, ctlUpdateRequestOrder, ctlGetSomeRequestOrderDetail,
  ctlVoidOrder
} from '../../../controllers/v2/inventory/ctlRequestOrder'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/request-order'
const apiRouter = [
  apiRoute,
  apiRoute + '/category',
  apiRoute + '/:store',
  apiRoute + '/:store/detail/:trans',
  apiRoute + '/:store/detail'
]

router.get(apiRouter[1], requireAuth, ctlGetRequestOrderCategory)
router.get(apiRouter[2], requireAuth, ctlGetRequestOrderHeader)
router.get(apiRouter[3], requireAuth, ctlGetRequestOrderDetail)
router.get(apiRouter[4], requireAuth, ctlGetSomeRequestOrderDetail)
router.post(apiRouter[0], requireAuth, ctlCreateRequestOrder)
router.put(apiRouter[3], requireAuth, ctlUpdateRequestOrder)
router.delete(apiRouter[4], requireAuth, ctlVoidOrder)


export default router