import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getData, getData3, getData4 }
  from '../../../controllers/Report/woReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/wo'
const apiRoute1 = project.api_prefix + '/report/wo/detail'
const apiRoute2 = project.api_prefix + '/report/wo/check'
const apiRouter = [
  apiRoute, // 0
  apiRoute1, // 1
  apiRoute2 // 2
]

// MAIN //

router.get(apiRouter[0], requireAuth, getData) // get peak hour
router.get(apiRouter[1], requireAuth, getData3) // get data detail
router.get(apiRouter[2], requireAuth, getData4) // get peak check

// MAIN //

export default router