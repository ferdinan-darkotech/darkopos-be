import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlGetAccessGrantedByKeyCode, ctlGetAccessGrantedByCode, ctlGetAccessSPKFields } from '../../../controllers/v2/setting/ctlAccessGranted'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/access-granted'
const apiRoutes = [
  apiRoute,
  `${apiRoute}/all`,
  `${apiRoute}/wo-fields`
]

router.get(apiRoutes[1], requireAuth, ctlGetAccessGrantedByCode)
router.get(apiRoutes[0], requireAuth, ctlGetAccessGrantedByKeyCode)
router.get(apiRoutes[2], requireAuth, ctlGetAccessSPKFields)

export default router