import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { getJobRolesGeneral, getJobRolesFilter, getJobRoleByCode, insertJobRole, updateJobRole, deleteJobRole }
  from '../../../../controllers/v2/master/humanresource/ctlJobRole'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/jobs/roles'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getJobRolesGeneral)
router.get(apiRouter[1], requireAuth, getJobRolesFilter)
router.get(apiRouter[2], requireAuth, getJobRoleByCode)
router.post(apiRouter[0], requireAuth, insertJobRole)
router.put(apiRouter[2], requireAuth, updateJobRole)
router.delete(apiRouter[2], requireAuth, deleteJobRole)
// MAIN //

export default router