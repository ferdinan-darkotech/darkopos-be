import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { pushWa } from '../../../controllers/v2/notification/ctlNotificationWa'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/notification/wa'
const apiRouter = [
  apiRoute,
]

router.post(apiRouter[0], requireAuth, pushWa)

export default router
