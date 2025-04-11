import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlGetInsentiveRoles, ctlModifyInsentiveRoles } from '../../../../controllers/v2/master/general/ctlInsentiveRoles'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/insentive-roles'
const apiRoutes = [
  `${apiRoute}`
]

// get all data store
router.get(apiRoutes[0], requireAuth, ctlGetInsentiveRoles)
router.post(apiRoutes[0], requireAuth, ctlModifyInsentiveRoles)


export default router