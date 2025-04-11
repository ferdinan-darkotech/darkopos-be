import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlNativeQueryStrings } from '../../../controllers/v2/setting/ctlNativeQuery'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/native-query'
const apiRoutes = [
  apiRoute
]

router.post(apiRoutes[0], requireAuth, ctlNativeQueryStrings)

export default router