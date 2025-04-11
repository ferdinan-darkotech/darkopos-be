import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  ctlGetWilayah
} from '../../../../controllers/v2/master/other/ctlWilayah'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/regions'
const apiRouter = [
  apiRoute
]

router.get(apiRouter[0], requireAuth, ctlGetWilayah)


export default router