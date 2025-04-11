import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlPackLov } from '../../../controllers/v2/other/ctlPackLov'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/pack-lov/:type'
const apiRouter = [
  apiRoute
]

// MAIN //
router.get(apiRouter[0], requireAuth, ctlPackLov)
// MAIN //

export default router