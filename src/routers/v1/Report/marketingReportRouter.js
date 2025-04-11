import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getData }
  from '../../../controllers/Report/marketingReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/marketing'
const apiRouter = [
  apiRoute + '/target'
]

// MAIN //

router.get(apiRouter[0], requireAuth, getData) // get peak hour

// MAIN //

export default router