import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getTransByNoIn, getTransData, insertTransferIn, cancelTransferIn }
  from '../../controllers/mutasiInController'

const router = express.Router()

const apiRoute = project.api_prefix + '/transfer/in'
const apiRouter = [
  apiRoute,
  apiRoute + '/code',
  apiRoute + '/cancel',
]

// MAIN //
router.get(apiRouter[1], requireAuth, getTransByNoIn)

router.get(apiRouter[0], requireAuth, getTransData)

router.post(apiRouter[0], requireAuth, insertTransferIn)

router.put(apiRouter[2], requireAuth, cancelTransferIn)
// MAIN //

export default router
