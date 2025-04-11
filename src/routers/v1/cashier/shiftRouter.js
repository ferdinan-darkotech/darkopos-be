import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getShift, getShifts, insertShift, updateShift, deleteShift }
  from '../../../controllers/cashier/shiftController'

const router = express.Router()

const apiRoute = project.api_prefix + '/cashiers/shifts'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getShift)

router.get(apiRouter[0], requireAuth, getShifts)

router.post(apiRouter[0], requireAuth, insertShift)

router.put(apiRouter[1], requireAuth, updateShift)

router.delete(apiRouter[1], requireAuth, deleteShift)
// MAIN //

export default router