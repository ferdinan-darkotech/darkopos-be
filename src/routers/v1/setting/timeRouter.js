import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getDateTime } from '../../../controllers/setting/timeController'

const router = express.Router()

const apiRoute = project.api_prefix + '/time'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
]

// MAIN //

router.get(apiRouter[1], requireAuth, getDateTime)

// MAIN //

export default router