/**
 * Created by Veirry on 17/09/2017.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getServiceReportTrans, getServiceReportMechanic, getDataServiceDetail } from '../../../controllers/Report/serviceReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/service'
const apiRouter = [
    apiRoute + '/trans',
    apiRoute + '/mechanic',
    apiRoute + '/detail',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getServiceReportTrans)
router.get(apiRouter[1], requireAuth, getServiceReportMechanic)
router.get(apiRouter[2], requireAuth, getDataServiceDetail)
// MAIN //

export default router