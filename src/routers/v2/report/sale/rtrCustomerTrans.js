import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { ctlCustomerSalesReport } from '../../../../controllers/v2/report/ctlCustomerTransReport'

const router = express.Router()

// will be re-route to report/lists
const apiRoute = project.api_prefix_v2 + '/report/customers-trans'
const apiRoutes = [
  apiRoute + '/:code',
]

// MAIN
router.post(apiRoutes[0], requireAuth, ctlCustomerSalesReport)
// MAIN


export default router
