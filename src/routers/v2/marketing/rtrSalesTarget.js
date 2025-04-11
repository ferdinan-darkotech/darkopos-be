import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlInsertTarget, ctlGetTarget, ctlGetTargetDetail, ctlGetTargetDetailByReference, ctlModifyTarget
} from '../../../controllers/v2/marketing/ctlSalesTarget'

const router = express.Router()

// will be re-route to report/lists
const apiRoute = project.api_prefix_v2 + '/marketing/target'
const apiRoutes = [
  apiRoute,
  apiRoute + '/:type/q',
  apiRoute + '/:referenceId'
]

// MAIN
router.get(apiRoutes[1], requireAuth, ctlGetTarget) // get header
router.get(apiRoutes[2], requireAuth, ctlGetTargetDetailByReference) //get detail by reference
router.post(apiRoutes[0], requireAuth, ctlInsertTarget) //create
router.put(apiRoutes[0], requireAuth, ctlModifyTarget) //edit
// MAIN

export default router
