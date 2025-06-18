// [MASTER STOCKS GROUP]: FERDINAN - 16/06/2025
import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlGetStocksGroup } from '../../../../controllers/v2/master/stocks/ctlStocksGroup'

const router = express.Router()

// will be re-route to report/lists
const apiRoute = project.api_prefix_v2 + '/stocks/groups'
const apiRoutes = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:groupCode'
]

// MAIN
router.get(apiRoutes[1], requireAuth, ctlGetStocksGroup)
// MAIN

export default router
