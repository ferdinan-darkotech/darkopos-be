import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { insertDataView, updateDataCall, insertDataCall, updateDataPendingCall, updateDataAcceptOffering, updateDataDenyOffering }
  from '../../../controllers/monitoring/followUpMainController'

const router = express.Router()

const apiRoute = project.api_prefix + '/followup/main'
const apiRouter = [
  apiRoute,
  apiRoute + '/view', // 1
  apiRoute + '/view' + '/:id', // 2
  apiRoute + '/call' + '/:id', // 3
  apiRoute + '/pending' + '/:id', // 4
  apiRoute + '/offering/accept' + '/:id', // 5
  apiRoute + '/offering/deny' + '/:id', // 6
]

// MAIN //
router.post(apiRouter[1], requireAuth, insertDataView)

router.put(apiRouter[2], requireAuth, updateDataCall)

router.post(apiRouter[3], requireAuth, insertDataCall)

router.put(apiRouter[4], requireAuth, updateDataPendingCall)

router.put(apiRouter[5], requireAuth, updateDataAcceptOffering)

router.put(apiRouter[6], requireAuth, updateDataDenyOffering)
// MAIN //

export default router