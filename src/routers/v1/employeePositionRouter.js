import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getPosition, getPositions, insertPosition, updatePosition, deletePosition, deletePositions }
  from '../../controllers/employeePositionController'

const router = express.Router()

const apiRoute = project.api_prefix + '/employees/positions'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getPosition)

router.get(apiRouter[0], requireAuth, getPositions)

router.post(apiRouter[1], requireAuth, insertPosition)

router.put(apiRouter[1], requireAuth, updatePosition)

router.delete(apiRouter[1], requireAuth, deletePosition)

router.delete(apiRouter[0], requireAuth, deletePositions)
// MAIN //

export default router