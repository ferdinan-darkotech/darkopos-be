/**
 * Created by Veirry on 29/09/2017.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getByTrans } from '../../../controllers/Report/cashEntryReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/cashentry'
const apiRouter = [
    apiRoute
]

// MAIN //
router.get(apiRouter[0], requireAuth, getByTrans)
// MAIN //

export default router
