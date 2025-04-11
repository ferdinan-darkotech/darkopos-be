import express from 'express'
import { requireAuth } from '../../../services/v1/usersService'
import project from '../../../../config/project.config'
import {
  ctlGetSomeCustomerCoupon, ctlGetCustomerCouponByMemberAndPlat,
  ctlGetCustomerCouponByMemberCode, ctlCreateCustomerCoupon,
  ctlGetHistoryCouponClaim, ctlGetHistorySalesIncludeCoupon,
  ctlVerifiedCouponItems, ctlGetReportCustomerPointReceived,
  ctlGetReportCustomerPointUsed, ctlInsertManualCustomerPoint
} from '../../../controllers/v2/transaction/ctlTransCustomerCoupon'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/customer-coupon'
const apiRouter = [
  apiRoute + '/trans',
  apiRoute + '/trans/:member',
  apiRoute + '/trans/:member/:policeno',
  apiRoute + '/history/sales/:coupon',
  apiRoute + '/history/claim/:coupon',
  apiRoute + '/verify/:store',
  apiRoute + '/report/receive/:store',
  apiRoute + '/report/used/:store',
  apiRoute + '/manual/insert-point'
]

router.get(apiRouter[0], requireAuth, ctlGetSomeCustomerCoupon)
router.get(apiRouter[1], requireAuth, ctlGetCustomerCouponByMemberCode)
router.get(apiRouter[2], requireAuth, ctlGetCustomerCouponByMemberAndPlat)
router.get(apiRouter[3], requireAuth, ctlGetHistorySalesIncludeCoupon)
router.get(apiRouter[4], requireAuth, ctlGetHistoryCouponClaim)
router.post(apiRouter[2], requireAuth, ctlCreateCustomerCoupon)
router.post(apiRouter[5], requireAuth, ctlVerifiedCouponItems)
router.post(apiRouter[6], requireAuth, ctlGetReportCustomerPointReceived)
router.post(apiRouter[7], requireAuth, ctlGetReportCustomerPointUsed)
router.post(apiRouter[8], requireAuth, ctlInsertManualCustomerPoint)



export default router
