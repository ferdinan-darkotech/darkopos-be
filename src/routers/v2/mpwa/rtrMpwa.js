// [MPWA CONNECT]: FERDINAN - 31/08/2025
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'

import * as MPWA_CONTROLLER from '../../../controllers/v2/mpwa/ctlMpwa'

const router = express.Router()
const mpwaRoute = project.api_prefix_v2 + '/mpwa'

router.post(`${mpwaRoute}/receive`, MPWA_CONTROLLER.getReceiveMessage)
router.post(`${mpwaRoute}/send`, requireAuth, MPWA_CONTROLLER.sendMessage)
router.post(`${mpwaRoute}/verification-member`, requireAuth, MPWA_CONTROLLER.sendVerificationToNumber)
router.post(`${mpwaRoute}/after-payment`, requireAuth, MPWA_CONTROLLER.sendMesageAfterPayment)

export default router
