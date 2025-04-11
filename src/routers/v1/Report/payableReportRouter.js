import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getTransByNoWithBank } from '../../../controllers/Report/payableReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/payment'
const apiRouter = [
  apiRoute + '/report/ap', // 0
  // apiRoute + '/report/ap/time', // 1
  // apiRoute + '/report/ap/group', // 2
  // apiRoute + '/report/pos', // 3
]

// MAIN //
// router.get(apiRouter[1], requireAuth, getTransByNoWithPOS)
router.get(apiRouter[0], requireAuth, getTransByNoWithBank)
// MAIN //

export default router