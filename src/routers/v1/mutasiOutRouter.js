import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getTransByNoOut, getTransByNoOutReceive, getTransData, insertTransferOut, cancelTransferOut }
  from '../../controllers/mutasiOutController'

const router = express.Router()

const apiRoute = project.api_prefix + '/transfer/out'
const apiRouter = [
  apiRoute,
  apiRoute + '/code',
  apiRoute + '/cancel',
  apiRoute + '/receive',
]

// MAIN //
router.get(apiRouter[1], requireAuth, getTransByNoOut)

router.get(apiRouter[3], requireAuth, getTransByNoOutReceive)

router.get(apiRouter[0], requireAuth, getTransData)

router.post(apiRouter[0], requireAuth, insertTransferOut)

router.put(apiRouter[2], requireAuth, cancelTransferOut)
// MAIN //

export default router