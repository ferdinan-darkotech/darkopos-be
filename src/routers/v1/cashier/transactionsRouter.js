/**
 * Created by p and a . has .my.i d on 2018-06-21.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getCashierTransactionSourceAll }
  from '../../../controllers/cashier/transactionsController'

const router = express.Router()

const apiRoute = project.api_prefix + '/cashiers/users'
const apiRouter = [
  apiRoute + '/:cashierid/transactions',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getCashierTransactionSourceAll)

// MAIN //

// OTHER //
// OTHER //

export default router