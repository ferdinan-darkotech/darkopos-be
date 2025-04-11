/**
 * Created by Veirry on 24/10/2017.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getReportSummaryFifo, getReportValueFifo, getBalanceFifo, getBalanceFifoProduct, getStockCardFifo, getTransferFifo } from '../../../controllers/Report/fifoReportControler'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/fifo'
const apiRouter = [
    apiRoute + '/products',
    apiRoute + '/value',
    apiRoute + '/balance',
    apiRoute + '/card',
    apiRoute + '/transfer',
    apiRoute + '/stock',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getReportSummaryFifo)
router.get(apiRouter[1], requireAuth, getReportValueFifo)
router.get(apiRouter[2], requireAuth, getBalanceFifo)
router.get(apiRouter[3], requireAuth, getStockCardFifo)
router.get(apiRouter[4], requireAuth, getTransferFifo)
router.get(apiRouter[5], requireAuth, getBalanceFifoProduct)

// MAIN //

export default router