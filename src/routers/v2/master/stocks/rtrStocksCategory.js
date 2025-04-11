import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlGetStocksCategory } from '../../../../controllers/v2/master/stocks/ctlStocksCategory'

const router = express.Router()

// will be re-route to report/lists
const apiRoute = project.api_prefix_v2 + '/stocks/categories'
const apiRoutes = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:categoryCode'
]

// MAIN
router.get(apiRoutes[1], requireAuth, ctlGetStocksCategory)
// MAIN

export default router
