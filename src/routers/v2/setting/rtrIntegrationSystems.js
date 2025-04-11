import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlGetAllIntegrationSystems, ctlGetSomeIntegrationSystems,
  ctlGetOneIntegrationSystems
} from '../../../controllers/v2/setting/ctlIntegrationSystems'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/config/integration/systems'
const apiRoutes = [
  apiRoute,
  `${apiRoute}/:code`,
  `${apiRoute}/:code/:key`
]

router.get(apiRoutes[0], requireAuth, ctlGetAllIntegrationSystems)
router.get(apiRoutes[1], requireAuth, ctlGetSomeIntegrationSystems)
router.get(apiRoutes[2], requireAuth, ctlGetOneIntegrationSystems)

export default router