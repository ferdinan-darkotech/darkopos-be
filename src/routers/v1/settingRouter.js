import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getSetting, getSettings, updateSetting, insertSetting }
  from '../../controllers/settingController'

const router = express.Router()

const apiRoute = project.api_prefix + '/setting'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getSetting)
router.get(apiRouter[0], requireAuth, getSettings)
router.post(apiRouter[1], requireAuth, insertSetting)
router.put(apiRouter[1], requireAuth, updateSetting)
// MAIN //

export default router
