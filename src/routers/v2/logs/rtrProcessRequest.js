import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlGetAllActiveProcessLogs, ctlGetSomeRequestReportLogs } from '../../../controllers/v2/logs/ctlProcessRequest'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/system-logs'
const apiRouter = [
  apiRoute + '/active-process',
  apiRoute + '/history/:type'
]

// MAIN //
router.get(apiRouter[0], requireAuth, ctlGetAllActiveProcessLogs)
router.get(apiRouter[1], requireAuth, ctlGetSomeRequestReportLogs)

// MAIN //

export default router