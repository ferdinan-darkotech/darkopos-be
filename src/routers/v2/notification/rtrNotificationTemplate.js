import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getNotificationTemplatesGeneral, getNotificationTemplatesFilter, getNotificationTemplateByCode,
  insertNotificationTemplate, updateNotificationTemplate, deleteNotificationTemplate }
  from '../../../controllers/v2/notification/ctlNotificationTemplate'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/notification/templates'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getNotificationTemplatesGeneral)
router.get(apiRouter[1], requireAuth, getNotificationTemplatesFilter)
router.get(apiRouter[2], requireAuth, getNotificationTemplateByCode)
router.post(apiRouter[0], requireAuth, insertNotificationTemplate)
router.put(apiRouter[2], requireAuth, updateNotificationTemplate)
router.delete(apiRouter[2], requireAuth, deleteNotificationTemplate)
// MAIN //

export default router