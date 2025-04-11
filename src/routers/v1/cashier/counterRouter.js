import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getCounter, getCounters, insertCounter, updateCounter, deleteCounter }
  from '../../../controllers/cashier/counterController'

const router = express.Router()

const apiRoute = project.api_prefix + '/cashiers/counters'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getCounter)

router.get(apiRouter[0], requireAuth, getCounters)

router.post(apiRouter[0], requireAuth, insertCounter)

router.put(apiRouter[1], requireAuth, updateCounter)

router.delete(apiRouter[1], requireAuth, deleteCounter)
// MAIN //

export default router