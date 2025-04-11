import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getData, getDataChangeTransferOut, getDataChangeTransferIn }
  from '../../controllers/transferOutDetailHpokokController'

const router = express.Router()

const apiRoute = project.api_prefix + '/transfer/hpokok/out/detail'
const apiRoute2 = project.api_prefix + '/transfer/hpokok/out/change'
const apiRoute3 = project.api_prefix + '/transfer/hpokok/in/change'
const apiRouter = [
  apiRoute,
  apiRoute2,
  apiRoute3
]

// MAIN //
router.get(apiRouter[0], requireAuth, getData)
router.get(apiRouter[1], requireAuth, getDataChangeTransferOut)
router.get(apiRouter[2], requireAuth, getDataChangeTransferIn)
// MAIN //

export default router