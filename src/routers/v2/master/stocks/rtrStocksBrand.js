import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlGetStocksBrand } from '../../../../controllers/v2/master/stocks/ctlStocksBrand'

const router = express.Router()

// will be re-route to report/lists
const apiRoute = project.api_prefix_v2 + '/stocks/brand'
const apiRoutes = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:brandCode'
]

// MAIN
router.get(apiRoutes[1], requireAuth, ctlGetStocksBrand)
// MAIN

export default router
