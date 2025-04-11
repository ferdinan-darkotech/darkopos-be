/**
 * Created by p a nd a . h a s .m y.id on 2018-06-11.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getCashRegister, getCashRegisters, insertCashRegister, updateCashRegister,
  getCashRegisterDetails, getCashRegisterDetailsByLog
  // deleteUserCashier
  } from '../../../controllers/cashier/cashRegisterController'

const router = express.Router()

const apiRoute = project.api_prefix + '/cashiers/cashregisters'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/:id/details',
  apiRoute + '/:id/details/:logid',
]

// MAIN //
router.get(apiRouter[1], requireAuth, getCashRegister)

router.get(apiRouter[0], requireAuth, getCashRegisters)

router.post(apiRouter[0], requireAuth, insertCashRegister)

router.put(apiRouter[1], requireAuth, updateCashRegister)

router.get(apiRouter[2], requireAuth, getCashRegisterDetails)

router.get(apiRouter[3], requireAuth, getCashRegisterDetailsByLog)

// router.delete(apiRouter[1], requireAuth, deleteUserCashier)
// MAIN //

// OTHER //
// router.put(apiRouter[1], requireAuth, requestOpenCashRegister)
// OTHER //

export default router