import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlCreateDataArea, ctlGetDataArea, ctlUpdateDataArea } from '../../../controllers/v2/master/ctlArea'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/area'
const apiRoutes = [
  `${apiRoute}`,
  `${apiRoute}/:code`,
]

// get all data store
router.get(apiRoutes[0], requireAuth, ctlGetDataArea)
router.post(apiRoutes[0], requireAuth, ctlCreateDataArea)
router.put(apiRoutes[1], requireAuth, ctlUpdateDataArea)


export default router