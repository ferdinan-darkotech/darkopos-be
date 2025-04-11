import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlGetAllKeyVariables, ctlGetConfigVariables, ctlSetConfigVariables, ctlDropConfigVariables
} from '../../../controllers/v2/setting/ctlGlobalVariables'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/config/global-variables'


router.get(apiRoute, requireAuth, ctlGetAllKeyVariables)
router.post(apiRoute, requireAuth, ctlGetConfigVariables)
router.put(apiRoute, requireAuth, ctlSetConfigVariables)
router.delete(apiRoute, requireAuth, ctlDropConfigVariables)

export default router