import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1//usersService'
import {
  ctlCreatedMemberCategory, ctlGetMemberCategory, ctlUpdatedMemberCategory
} from '../../../../controllers/v2/master/customer/ctlCustomerCategory'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/customers-category'
const apiRoutes = [
  `${apiRoute}`
]

// get all data store
router.get(apiRoutes[0], ctlGetMemberCategory)
router.post(apiRoutes[0], requireAuth, ctlCreatedMemberCategory)
router.put(apiRoutes[0], requireAuth, ctlUpdatedMemberCategory)


export default router