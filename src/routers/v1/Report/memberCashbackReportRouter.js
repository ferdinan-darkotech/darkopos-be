import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getData }
  from '../../../controllers/Report/memberCashbackReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/cashback'
const apiRouter = [
  apiRoute, // 0
  apiRoute + '/:id', // 1
]

// MAIN //

router.get(apiRouter[0], requireAuth, getData)

// MAIN //

export default router