import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlGetCustomReportOptions, ctlGetCustomReportForm
} from '../../../controllers/v2/report/ctlCustomReport'

const router = express.Router()

// will be re-route to report/lists
const apiRoute = project.api_prefix_v2 + '/report/custom'
const apiRoutes = [
  apiRoute,
  apiRoute + '/form/:form_code'
]

// MAIN
router.get(apiRoutes[0], requireAuth, ctlGetCustomReportOptions)
router.get(apiRoutes[1], requireAuth, ctlGetCustomReportForm)
// MAIN

export default router
