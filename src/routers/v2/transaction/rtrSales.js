import express from 'express'
import { requireAuth } from '../../../services/v1/usersService'
import project from '../../../../config/project.config'
import * as ctl from '../../../controllers/v2/transaction/ctlSales'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/sales'

const apiRouter = [
  apiRoute + '/tax-series',
  apiRoute + '/tax-series/:invoice',
  apiRoute + '/trans/:store/:transNo',

  // [POS SALES ONE DAY]: FERDINAN - 2025-04-24
  apiRoute + '/date/:store',
]


router.get(apiRouter[0], requireAuth, ctl.ctlGetPendingTaxSeries)
router.put(apiRouter[1], requireAuth, ctl.ctlRegenerateTaxSeries)
router.get(apiRouter[2], requireAuth, ctl.ctlGetSaleByStoreTransNo)

// [POS SALES ONE DAY]: FERDINAN - 2025-04-24
router.get(apiRouter[3], requireAuth, ctl.ctlGetSaleByStoreInOneDay)

export default router
