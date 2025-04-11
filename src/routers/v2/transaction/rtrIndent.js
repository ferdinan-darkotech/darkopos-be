import express from 'express'
import { requireAuth } from '../../../services/v1/usersService'
import project from '../../../../config/project.config'
import {
  ctlCancelStockIndent, ctlCreateIndent, ctlGetSomeStockIndent,
  ctlGetStockIndentDetail, ctlUpdateIndent, ctlGetAllIndentDetailByMember,
  ctlGetAllIndentCancelByTrans, ctlGetAllIndentCancelDetailByTrans,
  ctlGetAllIndentByMember, ctlGetExistsStockIndentDetail,
  ctlGetReportSalesIndent, ctlGetReportSalesIndentDetail
} from '../../../controllers/v2/transaction/ctlIndent'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/transaction/stock-indent'
const apiRouteCancel = project.api_prefix_v2 + '/transaction/cancel-indent'
const apiSalesIndent = project.api_prefix_v2 + '/transaction/sales-indent'
const apiSalesIndentReport = project.api_prefix_v2 + '/report/sales-indent'

const apiRouter = [
  apiRoute,
  apiRoute + '/:store',
  apiRoute + '/:store/:trans',

  apiRouteCancel,
  apiRouteCancel + '/detail',

  apiSalesIndent + '/:member',
  apiSalesIndent + '/detail/:member',
  apiSalesIndent + '/detail/:store/:trans',

  apiSalesIndentReport + '/summary/:store',
  apiSalesIndentReport + '/detail/:store'
]

router.get(apiRouter[0], requireAuth, ctlGetSomeStockIndent)
router.get(apiRouter[2], requireAuth, ctlGetStockIndentDetail)
router.post(apiRouter[1], requireAuth, ctlCreateIndent)
router.put(apiRouter[2], requireAuth, ctlUpdateIndent)
router.post(apiRouter[2], requireAuth, ctlCancelStockIndent)

router.get(apiRouter[3], requireAuth, ctlGetAllIndentCancelByTrans)
router.get(apiRouter[4], requireAuth, ctlGetAllIndentCancelDetailByTrans)

router.get(apiRouter[5], requireAuth, ctlGetAllIndentByMember)
router.get(apiRouter[6], requireAuth, ctlGetAllIndentDetailByMember)
router.get(apiRouter[7], requireAuth, ctlGetExistsStockIndentDetail)
router.post(apiRouter[8], requireAuth, ctlGetReportSalesIndent)
router.post(apiRouter[9], requireAuth, ctlGetReportSalesIndentDetail)

export default router
