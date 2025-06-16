import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  ctlGetWilayah, ctlGetRegion, ctlGetRegionByKodeKelurahan
} from '../../../../controllers/v2/master/other/ctlWilayah'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/regions'
const apiRouter = [
  apiRoute,

  // [STORE GET REGION]: FERDINAN - 2025-06-11
  apiRoute + '/store',
  apiRoute + '/store/:storeid'
]

router.get(apiRouter[0], requireAuth, ctlGetWilayah)

// [STORE GET REGION]: FERDINAN - 2025-06-11
router.get(apiRouter[1], requireAuth, ctlGetRegion)

// [STORE GET REGION]: FERDINAN - 2025-06-11
router.get(apiRouter[2], requireAuth, ctlGetRegionByKodeKelurahan)


export default router