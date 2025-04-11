import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlCreateDataDivision, ctlGetDataDivision, ctlUpdateDataDivision } from '../../../../controllers/v2/master/other/ctlDivision'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/division'
const apiRoutes = [
  `${apiRoute}`,
  `${apiRoute}/:code`,
]

// get all data store
router.get(apiRoutes[0], requireAuth, ctlGetDataDivision)
router.post(apiRoutes[0], requireAuth, ctlCreateDataDivision)
router.put(apiRoutes[1], requireAuth, ctlUpdateDataDivision)


export default router