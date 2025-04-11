import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { getCustomerGroupsGeneral, getCustomerGroupsFilter, getCustomerGroupByCode,
  insertCustomerGroup, updateCustomerGroup, deleteCustomerGroup }
  from '../../../../controllers/v2/master/customer/ctlCustomerGroup'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/customers/groups'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getCustomerGroupsGeneral)
router.get(apiRouter[1], requireAuth, getCustomerGroupsFilter)
router.get(apiRouter[2], requireAuth, getCustomerGroupByCode)
router.post(apiRouter[0], requireAuth, insertCustomerGroup)
router.put(apiRouter[2], requireAuth, updateCustomerGroup)
router.delete(apiRouter[2], requireAuth, deleteCustomerGroup)
// MAIN //

export default router