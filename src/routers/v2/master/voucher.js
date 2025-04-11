import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlCreateVoucher, ctlGetVoucherDetail, ctlGetVoucherHeader, ctlUpdateVoucher } from '../../../controllers/v2/master/ctlVoucher'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/voucher'
const apiRoutes = [
  `${apiRoute}`,
  `${apiRoute}/:code`,
]

// get all data store
router.get(apiRoutes[0], requireAuth, ctlGetVoucherHeader)
router.get(apiRoutes[1], requireAuth, ctlGetVoucherDetail)
router.post(apiRoutes[0], requireAuth, ctlCreateVoucher)
router.put(apiRoutes[1], requireAuth, ctlUpdateVoucher)


export default router