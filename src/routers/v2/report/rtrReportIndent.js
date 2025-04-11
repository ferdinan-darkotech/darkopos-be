import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlDetailReportIndent, ctlDetailReportReturIndent,
  ctlRecapReportIndent, ctlRecapReportReturIndent
} from '../../../controllers/v2/report/ctlReportIndent'

const router = express.Router()

// will be re-route to report/lists
const apiRoute = project.api_prefix_v2 + '/report/indent'
const apiRoutes = [
  apiRoute + '/sum-indent',
  apiRoute + '/dtl-indent',
  apiRoute + '/sum-ret-indent',
  apiRoute + '/dtl-ret-indent',
]

// MAIN
router.post(apiRoutes[0], requireAuth, ctlRecapReportIndent)
router.post(apiRoutes[1], requireAuth, ctlDetailReportIndent)
router.post(apiRoutes[2], requireAuth, ctlRecapReportReturIndent)
router.post(apiRoutes[3], requireAuth, ctlDetailReportReturIndent)
// MAIN

export default router
