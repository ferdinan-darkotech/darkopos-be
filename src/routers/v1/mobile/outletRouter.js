import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getAllOutlet } from '../../../controllers/mobile/outletController'

const router = express.Router()

const apiRoute = project.api_prefix + '/mobile/outlets'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
]

// MAIN //

router.get(apiRouter[0], requireAuth, getAllOutlet)

// MAIN //

export default router