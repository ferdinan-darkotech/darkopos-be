/**
 * Created by Veirry on 29/09/2017.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getAdjInReport, getAdjOutReport, getReturnOutTrans } from '../../../controllers/Report/adjustReportControler'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/adjust'
const apiRouter = [
    apiRoute + '/in',
    apiRoute + '/out',
    apiRoute + '/out/return',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getAdjInReport)
router.get(apiRouter[1], requireAuth, getAdjOutReport)
router.get(apiRouter[2], requireAuth, getReturnOutTrans)
// MAIN //

export default router
