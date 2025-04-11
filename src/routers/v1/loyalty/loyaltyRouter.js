import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getDataId, getDataIdActive, getData, updateData, insertData, cancelData, deleteData }
  from '../../../controllers/loyalty/loyaltyController'

const router = express.Router()

const apiRoute = project.api_prefix + '/loyalty'
const apiRoute1 = project.api_prefix + '/loyaltyactive'
const apiRouter = [
  apiRoute, // 0
  apiRoute + '/:id', // 1
  apiRoute1, // 2
  apiRoute1 + '/:id' // 3
]

// MAIN //
router.get(apiRouter[1], requireAuth, getDataId)

router.get(apiRouter[0], requireAuth, getData)

router.get(apiRouter[2], requireAuth, getDataIdActive)

router.post(apiRouter[0], requireAuth, insertData)

router.put(apiRouter[1], requireAuth, updateData)

router.put(apiRouter[3], requireAuth, cancelData)

router.delete(apiRouter[1], requireAuth, deleteData)

// MAIN //

export default router