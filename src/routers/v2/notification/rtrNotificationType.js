import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getNotificationTypesGeneral, getNotificationTypesFilter, getNotificationTypeByCode,
  insertNotificationType, updateNotificationType, deleteNotificationType }
  from '../../../controllers/v2/notification/ctlNotificationType'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/notification/types'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getNotificationTypesGeneral)
router.get(apiRouter[1], requireAuth, getNotificationTypesFilter)
router.get(apiRouter[2], requireAuth, getNotificationTypeByCode)
router.post(apiRouter[0], requireAuth, insertNotificationType)
router.put(apiRouter[2], requireAuth, updateNotificationType)
router.delete(apiRouter[2], requireAuth, deleteNotificationType)
// MAIN //

export default router