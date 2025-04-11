import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getCashEntry, getCashEntries, insertCashEntry, updateCashEntry, deleteCashEntry }
  from '../../../controllers/cashier/cashEntryController'

const router = express.Router()

const apiRoute = project.api_prefix + '/cashiers/cashentry'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getCashEntry)

router.get(apiRouter[0], requireAuth, getCashEntries)

router.post(apiRouter[0], requireAuth, insertCashEntry)

router.put(apiRouter[1], requireAuth, updateCashEntry)

router.delete(apiRouter[1], requireAuth, deleteCashEntry)
// MAIN //

export default router