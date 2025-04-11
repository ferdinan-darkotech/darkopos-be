import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlGetApproval, ctlUpdateApproval, ctlGetApprovalOptions, ctlGetApprovalProgress, ctlEditApproval,
  ctlGetListApproval
} from '../../../controllers/v2/monitoring/ctlApproval'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/approval-system'
const apiRouter = [
  apiRoute,
  apiRoute + '/options',
  apiRoute + '/inprogress',
  apiRoute + '/modify/:type',
  apiRoute + '/lists'
]

router.get(apiRouter[0], requireAuth, ctlGetApproval)
router.get(apiRouter[1], requireAuth, ctlGetApprovalOptions)
router.get(apiRouter[2], requireAuth, ctlGetApprovalProgress)
router.put(apiRouter[0], requireAuth, ctlUpdateApproval)
router.put(apiRouter[3], requireAuth, ctlEditApproval)
router.get(apiRouter[4], requireAuth, ctlGetListApproval)


export default router