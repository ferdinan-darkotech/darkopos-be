import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getNotificationTimersGeneral, getNotificationTimersFilter, getNotificationTimerByCode,
  insertNotificationTimer, updateNotificationTimer, deleteNotificationTimer }
  from '../../../controllers/v2/notification/ctlNotificationTimer'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/notification/timers'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getNotificationTimersGeneral)
router.get(apiRouter[1], requireAuth, getNotificationTimersFilter)
router.get(apiRouter[2], requireAuth, getNotificationTimerByCode)
router.post(apiRouter[0], requireAuth, insertNotificationTimer)
router.put(apiRouter[2], requireAuth, updateNotificationTimer)
router.delete(apiRouter[2], requireAuth, deleteNotificationTimer)
// MAIN //

export default router