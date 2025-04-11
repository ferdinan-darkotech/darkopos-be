/**
 * Created by Veirry on 18/09/2017.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  getDataReportPos,
} from '../../../controllers/Report/bundlingReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/bundling'
const apiRouter = [
  apiRoute + '/daily',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getDataReportPos)
// MAIN //

export default router
