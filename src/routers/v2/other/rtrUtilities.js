import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlGetDistanceTwoPointByRoute } from '../../../controllers/v2/other/ctlUtilities'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/utilities'
const apiRouter = [
  apiRoute + '/geo/distance/route'
]

// MAIN //
router.post(apiRouter[0], requireAuth, ctlGetDistanceTwoPointByRoute)
// MAIN //

export default router