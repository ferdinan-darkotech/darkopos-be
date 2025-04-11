import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlGetRolesDiscount, ctlGetLogRolesDiscount, ctlModifierRolesDiscount } from '../../../../controllers/v2/master/stocks/ctlRoleDiscount'

const router = express.Router()

// will be re-route to report/lists
const apiRoute = project.api_prefix_v2 + '/stocks/role-discount'
const apiRoutes = [
  apiRoute,
  apiRoute + '/:type',
  apiRoute + '/log/:store'
]

// MAIN
router.get(apiRoutes[0], requireAuth, ctlGetRolesDiscount)
router.post(apiRoutes[1], requireAuth, ctlModifierRolesDiscount)
router.get(apiRoutes[2], requireAuth, ctlGetLogRolesDiscount)
// MAIN

export default router
