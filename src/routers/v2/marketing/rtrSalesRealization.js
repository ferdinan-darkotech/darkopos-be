import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { ctlGetSalesRealizations } from '../../../controllers/v2/marketing/ctlSalesRealization'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/marketing/realizations'
const apiRouter = [
  apiRoute,
]

// MAIN //
router.get(apiRouter[0], requireAuth, ctlGetSalesRealizations)
// MAIN //

export default router