import express from 'express'
import { requireAuth } from '../../../services/v1/usersService'
import project from '../../../../config/project.config'
import {
  ctlCreateVoucher, ctlGetVoucherList, ctlGetVoucherSalesDetail,
  ctlGetVoucherSalesHeader, ctlGetVoucherSalesItem, ctlGetDetailItem
} from '../../../controllers/v2/transaction/ctlVoucherSales'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/vouchersales'
const apiRouter = [
  apiRoute,
  apiRoute + '/list',
  apiRoute + '/:store',
  apiRoute + '/detail/:store/:code',
  apiRoute + '/item/:membercode',
  apiRoute + '/itemvoucher/:voucher',
]

router.get(apiRouter[4], requireAuth, ctlGetVoucherSalesItem)
router.get(apiRouter[1], requireAuth, ctlGetVoucherList)
router.get(apiRouter[2], requireAuth, ctlGetVoucherSalesHeader)
router.get(apiRouter[3], requireAuth, ctlGetVoucherSalesDetail)
router.get(apiRouter[5], requireAuth, ctlGetDetailItem)
router.post(apiRouter[0], requireAuth, ctlCreateVoucher)

export default router
