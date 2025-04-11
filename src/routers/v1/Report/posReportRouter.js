/**
 * Created by Veirry on 18/09/2017.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  getPosReportTrans,
  getReportPosAndService,
  getReportPosAndServiceGroup,
  getPosReportTransCancel,
  getPosReportDaily,
  getPosDetailReport,
  getPosReportUnit,
  getMemberAssests,
  getTurnOver,
  getCompareSalesVsInventory,
  getHourlyCustomer,
  getHourCustomer,
  getIntervalHourCustomer,
  getReportRealisasi,
  getReportSalesPowerBI,
  getReportDataPowerBI,
  getReportDataTRMPowerBI,
  getReportDataSSRPowerBI
} from '../../../controllers/Report/posReportController'

const router = express.Router()

const apiRouteOld = project.api_prefix + '/posreport'
const apiRoute = project.api_prefix + '/report/pos'
const apiRouter = [
  apiRouteOld + '/trans', // 0
  apiRouteOld + '/all', // 1
  apiRouteOld + '/trans/cancel', // 2
  apiRoute + '/daily', // 3
  apiRoute + '/unit', // 4
  apiRoute + '/detail', // 5
  apiRoute + '/member/assets', // 6
  apiRoute + '/turnover', // 7
  apiRoute + '/compare', // 8
  apiRoute + '/hourly', // 9
  apiRoute + '/hour', // 10
  apiRoute + '/interval', // 11
  apiRouteOld + '/allgroup', // 12
  apiRouteOld + '/realisasi', // 13
  apiRouteOld + '/powerbi-sales', // 14
  apiRouteOld + '/powerbi-data', // 15
  apiRouteOld + '/powerbi-data-trm', // 16
  apiRouteOld + '/powerbi-data-ssr', // 17
]

// MAIN //
router.get(apiRouter[0], requireAuth, getPosReportTrans)
router.get(apiRouter[1], requireAuth, getReportPosAndService)
router.get(apiRouter[2], requireAuth, getPosReportTransCancel)
router.get(apiRouter[12], requireAuth, getReportPosAndServiceGroup)
router.post(apiRouter[13], requireAuth, getReportRealisasi)
router.post(apiRouter[14], requireAuth, getReportSalesPowerBI)
router.post(apiRouter[15], requireAuth, getReportDataPowerBI)
router.post(apiRouter[16], requireAuth, getReportDataTRMPowerBI)
router.post(apiRouter[17], requireAuth, getReportDataSSRPowerBI)

router.get(apiRouter[3], requireAuth, getPosReportDaily)
router.get(apiRouter[4], requireAuth, getPosReportUnit)
router.get(apiRouter[5], requireAuth, getPosDetailReport)
router.get(apiRouter[6], requireAuth, getMemberAssests)
router.get(apiRouter[7], requireAuth, getTurnOver)
router.get(apiRouter[8], requireAuth, getCompareSalesVsInventory)
router.post(apiRouter[9], requireAuth, getHourlyCustomer)
router.post(apiRouter[10], requireAuth, getHourCustomer)
router.post(apiRouter[11], requireAuth, getIntervalHourCustomer)
// MAIN //

export default router
