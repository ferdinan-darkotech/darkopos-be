import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getAdjust, getAllAdjust, getAllAdjustDetail, insertAdjust, updateAdjust, deleteAdjust, cancelAdjust }
  from '../../controllers/adjustController'

const router = express.Router()

const apiRoute = project.api_prefix + '/adjust'
const apiRoute1 = project.api_prefix + '/adjustdetail'
const apiRouter = [
  apiRoute,
  apiRoute + '/code' + '/:id',
  apiRoute1,
  apiRoute + '/cancel' + '/:id' + '/status' + '/:status'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getAdjust)

router.get(apiRouter[0], requireAuth, getAllAdjust)

router.get(apiRouter[2], requireAuth, getAllAdjustDetail)

router.post(apiRouter[1], requireAuth, insertAdjust)

router.put(apiRouter[2], requireAuth, updateAdjust)

router.put(apiRouter[3], requireAuth, cancelAdjust)

router.delete(apiRouter[1], requireAuth, deleteAdjust)

// MAIN //

export default router
