import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlGetDetailOsRequest, ctlGetHeaderOsRequest
} from '../../../controllers/v2/monitoring/ctlOSRequest'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/os-request'
const apiRouter = [
  apiRoute,
  apiRoute + '/:store',
  apiRoute + '/:store/detail/:trans',
]

router.get(apiRouter[1], requireAuth, ctlGetHeaderOsRequest)
router.get(apiRouter[2], requireAuth, ctlGetDetailOsRequest)


export default router