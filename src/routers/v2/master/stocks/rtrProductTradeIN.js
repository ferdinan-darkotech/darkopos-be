import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  ctlGetLogProductTradeIN, ctlGetProductTradeIN, ctlModifierProductTradeIN,
  ctlGetStockProductTradeIn, ctlGetStockProductSecond, ctlGetStockTradeInPerInvoices
} from '../../../../controllers/v2/master/stocks/ctlProductTradeIN'

const router = express.Router()

// will be re-route to report/lists

const apiRoute = project.api_prefix_v2 + '/master/product/trade-in'
const apiRouteStock = project.api_prefix_v2 + '/master/product-stock/trade-in'

const apiRoutes = [
  apiRoute,
  apiRoute + '/store/:store',
  apiRoute + '/log/:id',
  apiRouteStock,
  apiRouteStock + '/invoices'
]

// MAIN
router.get(apiRoutes[1], requireAuth, ctlGetProductTradeIN)
router.post(apiRoutes[0], requireAuth, ctlModifierProductTradeIN)
router.get(apiRoutes[2], requireAuth, ctlGetLogProductTradeIN)
router.get(apiRoutes[3], requireAuth, ctlGetStockProductSecond)
router.post(apiRoutes[4], requireAuth, ctlGetStockTradeInPerInvoices)
// MAIN

export default router
