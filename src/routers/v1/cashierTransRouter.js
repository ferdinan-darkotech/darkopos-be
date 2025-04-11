import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getCashierTransById, getCashierTransData, createCashierTrans, updateCashierTrans } from '../../controllers/cashierTransController'

const router = express.Router()

const apiRoute = project.api_prefix + '/cashierTrans'
const apiRouter = [
    apiRoute + '/:cashierId/:cashierNo/:shift/:status/:storeId',
    apiRoute + ''
]

// Get Cashier Trans By Id
router.get(apiRouter[0], requireAuth, getCashierTransById)

// Get CashierTrans List
router.get(apiRouter[1], requireAuth, getCashierTransData)

// Insert Cashier Trans
router.post(apiRouter[1], requireAuth, createCashierTrans)

// Update Cashier Trans
router.put(apiRouter[1], requireAuth, updateCashierTrans)

export default router