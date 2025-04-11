/**
 * Created by Veirry on 15/09/2017.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getPurchaseReportTrans, getPurchaseReportDaily, ctlGetReportTransit } from '../../../controllers/Report/purchaseReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/purchase'
const apiRouter = [
  apiRoute + '/trans',
  apiRoute + '/daily',
  apiRoute + '/intransit/:type'
]

// MAIN //
router.get(apiRouter[0], requireAuth, getPurchaseReportTrans)

router.get(apiRouter[1], requireAuth, getPurchaseReportDaily)

router.get(apiRouter[2], requireAuth, ctlGetReportTransit)
// MAIN //

export default router
