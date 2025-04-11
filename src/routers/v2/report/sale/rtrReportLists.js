import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlGetGeneralReports, ctlGetRootReports } from '../../../../controllers/v2/report/ctlReports'

const router = express.Router()

// will be re-route to report/lists
const apiRoute = project.api_prefix_v2 + '/report/lists'
const apiRoutes = [
  apiRoute,
  apiRoute + '/:root',
]

// MAIN
router.get(apiRoutes[0], requireAuth, ctlGetGeneralReports)
router.get(apiRoutes[1], requireAuth, ctlGetRootReports)
// MAIN

export default router
