import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getOutDetail, insertOutDetail, dropOutDetail }
  from '../../controllers/mutasiOutDetailController'

const router = express.Router()

const apiRoute = project.api_prefix + '/transfer/out/detail'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getOutDetail)

router.post(apiRouter[1], requireAuth, insertOutDetail)

router.delete(apiRouter[1], requireAuth, dropOutDetail)
// MAIN //

export default router