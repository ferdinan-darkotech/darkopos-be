import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlGetAllActiveNPSFormByGroup,
  ctlGetActiveRatingNPS
} from '../../../controllers/v2/marketing/ctlNPS'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/marketing/nps-form'
const apiRouter = [
  apiRoute,
  apiRoute + '/items/:group',
  apiRoute + '/link/ratings'
]


router.get(apiRouter[1], requireAuth, ctlGetAllActiveNPSFormByGroup)
router.get(apiRouter[2], requireAuth, ctlGetActiveRatingNPS)


export default router