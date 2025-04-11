import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlGetReportSale, ctlGetReportSaleByType, ctlGetReportSSR } from '../../../../controllers/v2/report/ctlReportSale'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/report/sale'
const apiRoutes = [
  apiRoute,
  apiRoute + '/:type'
]

router.get(apiRoutes[0], requireAuth, ctlGetReportSale)
router.get(apiRoutes[1], requireAuth, ctlGetReportSaleByType)
router.post(apiRoutes[1], requireAuth, ctlGetReportSaleByType)

export default router
