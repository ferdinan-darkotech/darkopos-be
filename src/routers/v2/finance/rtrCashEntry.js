import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlCreateCashEntry, ctlGetAllDetailCashEntry, ctlGetHeaderCashEntry, ctlUpdateCashEntry,
  ctlGetSummaryCashEntry, ctlGetReportCashEntry
} from '../../../controllers/v2/finance/ctlCashEntry'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/finance/cash-entry'
const apiRouter = [
  apiRoute,
  apiRoute + '/:store' + '/:transno',
  apiRoute + '/report/:type/:trans'
]

// MAIN //
router.get(apiRouter[0], requireAuth, ctlGetHeaderCashEntry)
router.get(apiRouter[1], requireAuth, ctlGetAllDetailCashEntry)
router.post(apiRouter[0], requireAuth, ctlCreateCashEntry)
router.put(apiRouter[1], requireAuth, ctlUpdateCashEntry)
router.get(apiRouter[2], requireAuth, ctlGetReportCashEntry)
// MAIN //

export default router