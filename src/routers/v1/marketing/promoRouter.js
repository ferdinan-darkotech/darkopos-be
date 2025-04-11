import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getDataId, getData, countData, updateData, insertData, deleteData }
  from '../../../controllers/marketing/promoController'

const router = express.Router()

const apiRoute = project.api_prefix + '/promo/main'
const apiRoute2 = project.api_prefix + '/promo/count'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute2
]

// MAIN //
router.get(apiRouter[1], requireAuth, getDataId)

router.get(apiRouter[0], requireAuth, getData)

router.get(apiRouter[2], requireAuth, countData)

router.post(apiRouter[0], requireAuth, insertData)

router.put(apiRouter[1], requireAuth, updateData)

router.delete(apiRouter[1], requireAuth, deleteData)
// MAIN //

export default router