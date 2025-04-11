import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlAllStore } from '../../../../controllers/v2/master/store/ctlStore'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/stores'
const apiRoutes = [
  `${apiRoute}`,
]

// get all data store
router.get(apiRoutes[0], requireAuth, ctlAllStore)


export default router