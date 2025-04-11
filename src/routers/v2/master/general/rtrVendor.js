import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlGetVendor, ctlCreatedVendor, ctlUpdatedVendor }
  from '../../../../controllers/v2/master/general/ctlVendor'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/master/vendor'
const apiRouter = [
  apiRoute,
  apiRoute + '/:vendor',
]

// MAIN //
router.get(apiRouter[0], ctlGetVendor)
router.post(apiRouter[0], requireAuth, ctlCreatedVendor)
router.put(apiRouter[1], requireAuth, ctlUpdatedVendor)
// MAIN //

export default router