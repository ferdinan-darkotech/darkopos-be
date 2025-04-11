import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getDataId, getData, updateData, cancelData, insertData, deleteData }
  from '../../../controllers/master/bundlingController'

const router = express.Router()

const apiRoute = project.api_prefix + '/promo/list'
const apiRoute2 = project.api_prefix + '/promo/cancel'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute2 + '/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getDataId)

router.get(apiRouter[0], requireAuth, getData)

router.post(apiRouter[0], requireAuth, insertData)

router.put(apiRouter[1], requireAuth, updateData)

router.put(apiRouter[2], requireAuth, cancelData)

router.delete(apiRouter[1], requireAuth, deleteData)
// MAIN //

export default router