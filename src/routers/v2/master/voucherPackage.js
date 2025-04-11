import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlCreateVoucherPackage, ctlGetVoucherPackageDetail, ctlGetVoucherPackageHeader, ctlUpdateVoucherPackage
} from '../../../controllers/v2/master/ctlVoucherPackage'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/voucherpackage'
const apiRoutes = [
  `${apiRoute}`,
  `${apiRoute}/:code`,
]

// get all data store
router.get(apiRoutes[0], requireAuth, ctlGetVoucherPackageHeader)
router.get(apiRoutes[1], requireAuth, ctlGetVoucherPackageDetail)
router.post(apiRoutes[0], requireAuth, ctlCreateVoucherPackage)
router.put(apiRoutes[1], requireAuth, ctlUpdateVoucherPackage)


export default router