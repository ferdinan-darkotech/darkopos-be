import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlGetAllKeyByCode, ctlGetOneUniqByKeyCode, ctlGetSomeKeyByCode } from '../../../controllers/v2/marketing/ctlBundlingV2'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/bundling/ukey'
const apiRouter = [
  apiRoute + '/data/:code',
  apiRoute + '/report/:code',
  apiRoute + '/data/:code/:key'
]

// MAIN //
router.get(apiRouter[0], requireAuth, ctlGetSomeKeyByCode)
router.get(apiRouter[1], requireAuth, ctlGetAllKeyByCode)
router.get(apiRouter[2], requireAuth, ctlGetOneUniqByKeyCode)
// MAIN //

export default router