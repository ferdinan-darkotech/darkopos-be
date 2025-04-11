/**
 * Created by panda . has . my . id on 4/17/17.
 */
import express from 'express'
// import { requireLogin, requireAuth } from '../../services/v1/usersService'
import { getIpAddress, getBEInfo } from '../../controllers/v1/utilsController'
import { requireAuth } from '../../services/v1/usersService'
import project from '../../../config/project.config'

const router = express.Router()

const apiRoute = project.api_prefix + '/utils'
const apiRouter = [
  apiRoute,
  apiRoute + '/be',
  apiRoute + '/checkSocketConnection'
]

router.get(apiRouter[1] + '/1', getIpAddress)

router.get(apiRouter[1] + '/2', getBEInfo)

router.post(apiRouter[2], requireAuth, getBEInfo)

export default router;