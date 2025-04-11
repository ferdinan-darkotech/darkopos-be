/**
 * Created by panda . has . my . id on 3/07/18.
 */
import express from 'express'
import { requireLogin, requireAuth } from '../../../services/v1/usersService'
import { getHeaderInfo, getNotificationGroup, reloadNotificationGroup, ctlGetNotifReminderByStoreRole }
  from '../../../controllers/dashboard/headerController'
import { getDashboard }
  from '../../../controllers/dashboard/dashboardController'
import project from '../../../../config/project.config'

const router = express.Router()

const apiRoute = project.api_prefix + '/dashboards'
const apiRoute2 = project.api_prefix_v2 + '/dashboards'
const apiRouter = [
  apiRoute,
  apiRoute + '/header',
  apiRoute + '/notification',
  apiRoute + '/notification/refresh',
  apiRoute2 + '/notification/reminder',
]

router.get(apiRouter[0], getDashboard)

router.post(apiRouter[1], getHeaderInfo)

router.post(apiRouter[2], getNotificationGroup)

router.post(apiRouter[3], reloadNotificationGroup)

router.get(apiRouter[4], ctlGetNotifReminderByStoreRole)

export default router;