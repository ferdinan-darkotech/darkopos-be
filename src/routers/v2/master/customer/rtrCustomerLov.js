import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import * as ctl from '../../../../controllers/v2/master/customer/ctlCustomerLov'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/customers/data-lov'
const apiRouter = [
  apiRoute,
  apiRoute + '/branch',
  apiRoute + '/branch/main',
  apiRoute + '/branch/params/:ids'
]

// MAIN //
router.get(apiRouter[0], requireAuth, ctl.ctlGetDataMemberLov)
router.get(apiRouter[2], requireAuth, ctl.ctlGetSomeMemberBranch)
router.get(apiRouter[1], requireAuth, ctl.ctlGetDataMemberBranch)
router.post(apiRouter[2], requireAuth, ctl.ctlCreateDataMemberBranch)
router.put(apiRouter[3], requireAuth, ctl.ctlUpdateDataMemberBranch)
// MAIN //

export default router