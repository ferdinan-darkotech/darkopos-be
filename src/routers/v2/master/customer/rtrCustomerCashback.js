import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { getCustomerCashbackByCode, getCustomersGeneral, getCustomersFilter, getCustomerByCode,
  insertCustomer, updateCustomer, deleteCustomer }
  from '../../../../controllers/v2/master/customer/ctlCustomerCashback'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/customers'
const apiRouter = [
  apiRoute + '/:code/cashback',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getCustomerCashbackByCode)
// MAIN //

export default router