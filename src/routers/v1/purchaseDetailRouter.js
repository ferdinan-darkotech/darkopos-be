import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getPurchaseDetail, getAllPurchaseDetail, insertPurchaseDetail, insertReturnDetail, insertPurchaseVoidDetail, updatePurchaseDetail, getPurchaseDetailService }
  from '../../controllers/purchaseDetailController'

const router = express.Router()

const apiRoute = project.api_prefix + '/purchasedetail'
const apiRouter = [
    apiRoute,
    apiRoute + '/:id',
    apiRoute + '/purchase',
    apiRoute + '/return',
    apiRoute + '/void',
    
    // [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
    apiRoute + '/service/store/:storeid/product/:productid',
]

// MAIN //
// [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
router.get(apiRouter[5], requireAuth, getPurchaseDetailService)

router.get(apiRouter[1], requireAuth, getPurchaseDetail)

router.get(apiRouter[0], requireAuth, getAllPurchaseDetail)

router.post(apiRouter[2], requireAuth, insertPurchaseDetail)

router.post(apiRouter[3], requireAuth, insertReturnDetail)

router.post(apiRouter[4], requireAuth, insertPurchaseVoidDetail)

router.put(apiRouter[0], requireAuth, updatePurchaseDetail)

export default router
