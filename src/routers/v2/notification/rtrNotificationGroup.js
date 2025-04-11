import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getNotificationGroupsGeneral, getNotificationGroupsFilter, getNotificationGroupByCode,
  insertNotificationGroup, updateNotificationGroup, deleteNotificationGroup }
  from '../../../controllers/v2/notification/ctlNotificationGroup'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/notification/groups'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getNotificationGroupsGeneral)
router.get(apiRouter[1], requireAuth, getNotificationGroupsFilter)
router.get(apiRouter[2], requireAuth, getNotificationGroupByCode)
router.post(apiRouter[0], requireAuth, insertNotificationGroup)
router.put(apiRouter[2], requireAuth, updateNotificationGroup)
router.delete(apiRouter[2], requireAuth, deleteNotificationGroup)
// MAIN //

export default router