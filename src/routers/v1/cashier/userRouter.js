/**
 * Created by p and a . has .my.i d on 2018-06-10.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getUserCashier, getUserCashiers,
  getUserCashierPeriods, getUserCashierPeriodByStatus,
  getUserCashierPeriodByStore, getUserCashierPeriodByStoreStatus,
  insertUserCashier, updateUserCashier, deleteUserCashier }
  from '../../../controllers/cashier/userController'

const router = express.Router()

const apiRoute = project.api_prefix + '/cashiers/users'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/:cashierid/periods',
  apiRoute + '/:cashierid/periods/store/:storeid',
  apiRoute + '/:cashierid/periods/store/:storeid/status/:status',
  apiRoute + '/:cashierid/periods/status/:status',
]

// MAIN //
router.get(apiRouter[1], requireAuth, getUserCashier)

router.get(apiRouter[0], requireAuth, getUserCashiers)

router.post(apiRouter[0], requireAuth, insertUserCashier)

router.put(apiRouter[1], requireAuth, updateUserCashier)

router.delete(apiRouter[1], requireAuth, deleteUserCashier)
// MAIN //

// OTHER //
router.get(apiRouter[2], requireAuth, getUserCashierPeriods)

router.get(apiRouter[3], requireAuth, getUserCashierPeriodByStore)

router.get(apiRouter[4], requireAuth, getUserCashierPeriodByStoreStatus)

router.get(apiRouter[5], requireAuth, getUserCashierPeriodByStatus)
// OTHER //

export default router