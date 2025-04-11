import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { getCustomerTypesGeneral, getCustomerTypesFilter, getCustomerTypeByCode,
  insertCustomerType, updateCustomerType, deleteCustomerType }
  from '../../../../controllers/v2/master/customer/ctlCustomerType'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/customers/types'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getCustomerTypesGeneral)
router.get(apiRouter[1], requireAuth, getCustomerTypesFilter)
router.get(apiRouter[2], requireAuth, getCustomerTypeByCode)
router.post(apiRouter[0], requireAuth, insertCustomerType)
router.put(apiRouter[2], requireAuth, updateCustomerType)
router.delete(apiRouter[2], requireAuth, deleteCustomerType)
// MAIN //

export default router