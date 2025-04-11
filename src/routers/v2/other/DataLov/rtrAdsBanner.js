import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import * as ads from '../../../../controllers/v2/other/DataLov/ctlAdsBanner'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/data/lov/banner-ads'
const apiRouter = [
  apiRoute,
  apiRoute + '/nps',
  apiRoute + '/params/:code'
]

// MAIN //
router.get(apiRouter[0], requireAuth, ads.ctlGetSomeAdsBanner)
router.get(apiRouter[1], requireAuth, ads.ctlGetAllAdsBanner)
router.post(apiRouter[0], requireAuth, ads.ctlCreateAdsBanner)
router.put(apiRouter[2], requireAuth, ads.ctlUpdateAdsBanner)
// MAIN //

export default router