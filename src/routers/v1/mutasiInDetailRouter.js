import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getInDetail, insertDetail, dropInDetail }
  from '../../controllers/mutasiInDetailController'

const router = express.Router()

const apiRoute = project.api_prefix + '/transfer/in/detail'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getInDetail)

router.post(apiRouter[1], requireAuth, insertDetail)

router.delete(apiRouter[1], requireAuth, dropInDetail)

// MAIN //

export default router