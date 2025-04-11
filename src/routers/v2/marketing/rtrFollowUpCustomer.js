import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlReminderCustomerChecks, ctlReminderCustomerProducts, ctlReminderCustomerMain } from '../../../controllers/v2/marketing/ctlFollowUpCustomer'

const router = express.Router()

const apiRouteReminderCust = project.api_prefix_v2 + '/marketing/customer-reminder'
const apiRouter = [
  apiRouteReminderCust,
  apiRouteReminderCust + '/check',
  apiRouteReminderCust + '/product'
]

// MAIN //
router.get(apiRouter[0], requireAuth, ctlReminderCustomerMain)
router.get(apiRouter[1], requireAuth, ctlReminderCustomerChecks)
router.get(apiRouter[2], requireAuth, ctlReminderCustomerProducts)
// MAIN //

export default router