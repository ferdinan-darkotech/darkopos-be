import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  ctlGetStockOnHand, ctlGetStockExists, ctlGetSomeStockOnHand, ctlGetStockOnHandByScanner, ctlGetSuggestionOrder,
  ctlBulkUpdateGlobalProduct, ctlGetTotalStock, ctlFindStockByCode, ctlGetStockLOV, ctlGetStockQuery, ctlFindHppStock
} from '../../../controllers/v2/inventory/ctlStocks'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/stocks'
const apiRouter = [
  apiRoute + '/onhand',
  apiRoute + '/onhand/:code',
  apiRoute + '/onhand-scanner/:store',
  apiRoute + '/onhand/store/:store',
  
  apiRoute + '/suggestion-order',
  apiRoute + '/bulk',
  apiRoute + '/onhand/total/:store',
  apiRoute + '/exists',
  apiRoute + '/lov',
  apiRoute + '/q',

  apiRoute + '/hpp-stock'
]

router.get(apiRouter[0], requireAuth, ctlGetStockOnHand)
router.get(apiRouter[1], requireAuth, ctlGetStockExists)
router.get(apiRouter[2], requireAuth, ctlGetStockOnHandByScanner)
router.post(apiRouter[3], requireAuth, ctlGetSomeStockOnHand)
router.get(apiRouter[4], requireAuth, ctlGetSuggestionOrder)
router.put(apiRouter[5], requireAuth, ctlBulkUpdateGlobalProduct)
// router.get(apiRouter[6], requireAuth, ctlGetTotalStock)
router.post(apiRouter[7], requireAuth, ctlFindStockByCode)
router.get(apiRouter[8], requireAuth, ctlGetStockLOV)
router.post(apiRouter[6], requireAuth, ctlGetTotalStock)
router.get(apiRouter[9], requireAuth, ctlGetStockQuery)
router.post(apiRouter[10], requireAuth, ctlFindHppStock)


export default router