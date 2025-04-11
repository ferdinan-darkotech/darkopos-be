import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlGetWarrantyProducts
} from '../../../controllers/v2/monitoring/ctlWarranty'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/warranty'
const apiRouter = [
  apiRoute,
  apiRoute + '/product/:store'
]

router.get(apiRouter[1], requireAuth, ctlGetWarrantyProducts)


export default router