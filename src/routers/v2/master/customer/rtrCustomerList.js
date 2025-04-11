import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { getCustomersGeneral, getCustomersFilter, getCustomerByCode,
  insertCustomer, updateCustomer, deleteCustomer, verificationNumberWA,verificationNumberFonnte,
  ctlGetListOfVerifiedMember, ctlGetInvoiceTemplateCustomer, fonnteWA, checkIsVerified, reVerify,
  ctlFixVerify
} from '../../../../controllers/v2/master/customer/ctlCustomerList'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/customers'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
  apiRoute + '/verify/WA',
  apiRoute + '/verify/report',
  apiRoute + '/send-invoice/template/:code',
  apiRoute + '/wa-messages',
  apiRoute + '/check/:number/:code',
  apiRoute + '/reverify/:number/:code',
  apiRoute + '/verify/whatsapp',
  apiRoute + '/fixverify/:wano/:mc'
]

// MAIN //
router.get(apiRouter[4], requireAuth, ctlGetListOfVerifiedMember)
router.post(apiRouter[3], requireAuth, verificationNumberWA)
router.post(apiRouter[9], requireAuth, verificationNumberFonnte)
router.get(apiRouter[0], requireAuth, getCustomersGeneral)
router.get(apiRouter[1], requireAuth, getCustomersFilter)
router.get(apiRouter[2], requireAuth, getCustomerByCode)
router.post(apiRouter[0], requireAuth, insertCustomer)
router.put(apiRouter[2], requireAuth, updateCustomer)
router.delete(apiRouter[2], requireAuth, deleteCustomer)
router.get(apiRouter[5], requireAuth, ctlGetInvoiceTemplateCustomer)
router.post(apiRouter[6], fonnteWA)
router.get(apiRouter[7], requireAuth, checkIsVerified)
router.put(apiRouter[8], requireAuth, reVerify)
router.get(apiRouter[10], requireAuth, ctlFixVerify)
// MAIN //

export default router