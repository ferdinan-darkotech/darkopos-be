import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getNotificationLogsGeneral, getNotificationLogsFilter, getNotificationLogById,
  insertNotificationLog, updateNotificationLog, deleteNotificationLog }
  from '../../../controllers/v2/notification/ctlNotificationLog'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/notification/logs'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:id',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getNotificationLogsGeneral)
router.get(apiRouter[1], requireAuth, getNotificationLogsFilter)
router.get(apiRouter[2], requireAuth, getNotificationLogById)
router.post(apiRouter[0], requireAuth, insertNotificationLog)
router.put(apiRouter[2], requireAuth, updateNotificationLog)
router.delete(apiRouter[2], requireAuth, deleteNotificationLog)
// MAIN //

export default router