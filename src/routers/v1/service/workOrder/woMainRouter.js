import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  insertData, insertDetail,
  
  // [NEW]: FERDINAN - 2025-03-03
  updateDataWo,
  updateDataWoProduct,
  insertDataProduct, 
  getWoSPKByWoId,

  // [NEW]: FERDINAN - 2025-03-17
  updateEmployeWo,

  // [UNIT NOT UPDATE ON WO WHEN CHANGE IN POS]: FERDINAN - 2025/07/02
  updateUnitWo, 
} from '../../../../controllers/service/workOrder/woMainController'

const router = express.Router()

const apiRoute = project.api_prefix + '/wo/main'
const apiRouter = [
  apiRoute,
  apiRoute + '/header',
  apiRoute + '/detail',
  apiRoute + '/product',

  // [NEW]: FERDINAN - 2025-03-02
  apiRoute + '/:id/spk',

  // [NEW]: FERDINAN - 2025-03-03
  apiRoute + '/:id',
  apiRoute + '/:id/product',
  apiRoute + '/:id/employee',

  // [UNIT NOT UPDATE ON WO WHEN CHANGE IN POS]: FERDINAN - 2025/07/02
  apiRoute + '/:id/unit',
]

// MAIN //
router.post(apiRouter[1], requireAuth, insertData)
router.post(apiRouter[2], requireAuth, insertDetail)
router.post(apiRouter[3], requireAuth, insertDataProduct)

// [NEW]: FERDINAN - 2025-03-02
router.get(apiRouter[4], requireAuth, getWoSPKByWoId)

// [NEW]: FERDINAN - 2025-03-023
router.put(apiRouter[5], requireAuth, updateDataWo)
router.put(apiRouter[6], requireAuth, updateDataWoProduct)

// [NEW]: FERDINAN - 2025-03-17
router.put(apiRouter[7], requireAuth, updateEmployeWo)

// [UNIT NOT UPDATE ON WO WHEN CHANGE IN POS]: FERDINAN - 2025/07/02
router.put(apiRouter[8], requireAuth, updateUnitWo)
// MAIN //

export default router