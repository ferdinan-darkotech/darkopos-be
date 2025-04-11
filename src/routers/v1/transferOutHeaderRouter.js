import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getData }
  from '../../controllers/transferOutHeaderController'

const router = express.Router()

const apiRoute = project.api_prefix + '/transfer/hpokok/out/header'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getData)
// MAIN //

export default router