import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  ctlGetWilayah, ctlGetRegion
} from '../../../../controllers/v2/master/other/ctlWilayah'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/regions'
const apiRouter = [
  apiRoute,

  // [STORE GET REGION]: FERDINAN - 2025-06-11
  apiRoute + '/store'
]

router.get(apiRouter[0], requireAuth, ctlGetWilayah)

// [STORE GET REGION]: FERDINAN - 2025-06-11
router.get(apiRouter[1], requireAuth, ctlGetRegion)


export default router