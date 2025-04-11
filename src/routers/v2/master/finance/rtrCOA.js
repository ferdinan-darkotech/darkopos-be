import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  ctlCreatedCOA, ctlGetCOA, ctlUpdateCOA
} from '../../../../controllers/v2/master/finance/ctlCOA'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/financial/coa'
const apiRouter = [
  apiRoute,
  apiRoute + '/:coacode'
]

// MAIN //
router.get(apiRouter[0], requireAuth, ctlGetCOA)
router.post(apiRouter[0], requireAuth, ctlCreatedCOA)
router.put(apiRouter[1], requireAuth, ctlUpdateCOA)
// MAIN //

export default router