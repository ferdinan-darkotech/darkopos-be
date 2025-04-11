import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlCreateDataDepartment, ctlGetDataDepartment, ctlUpdateDataDepartment } from '../../../../controllers/v2/master/other/ctlDepartment'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/department'
const apiRoutes = [
  `${apiRoute}`,
  `${apiRoute}/:code`,
]

// get all data store
router.get(apiRoutes[0], requireAuth, ctlGetDataDepartment)
router.post(apiRoutes[0], requireAuth, ctlCreateDataDepartment)
router.put(apiRoutes[1], requireAuth, ctlUpdateDataDepartment)


export default router