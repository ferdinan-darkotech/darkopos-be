import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getPurchase, getAllPurchase, insertPurchase, updatePurchase, deletePurchase, getLast, ctlReceiveStock, ctlGetTransitData }
  from '../../controllers/purchaseController'

const router = express.Router()

const apiRoute = project.api_prefix + '/purchase'
// const apiRoute2 = project.api_prefix + '/purchase/:transNo/:id'
const apiRoute2 = project.api_prefix + '/purchase/:transNo/:storeId'


// unknown usage :last - wi 20190716
// const apiRoute1 = project.api_prefix + '/purchase/:last'
const apiRoute1 = project.api_prefix + '/purchase/:transNo'
const apiRouter = [
    apiRoute,
    apiRoute1,
    apiRoute2
]

// MAIN //
router.get(apiRouter[2], requireAuth, getPurchase)

router.get(apiRouter[0], requireAuth, getAllPurchase)

// unknown usage getLast
// router.get(apiRouter[1], requireAuth, getLast)
router.get(apiRouter[1], requireAuth, getPurchase)

router.post(apiRouter[0], requireAuth, insertPurchase)

router.put(apiRouter[0], requireAuth, updatePurchase)

router.delete(apiRouter[0], requireAuth, deletePurchase)

// MAIN //

export default router
