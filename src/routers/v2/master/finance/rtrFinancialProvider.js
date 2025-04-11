import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  getFinancialProviders,
  insertFinancialProvider,
  updateFinancialProvider,
  deleteFinancialProvider
} from '../../../../controllers/v2/master/finance/ctlFinancialProvider'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/financial/providers'
const apiRouter = [
  apiRoute,
  apiRoute + '/:code'
]

// MAIN //
router.get(apiRouter[0], requireAuth, getFinancialProviders)
router.post(apiRouter[0], requireAuth, insertFinancialProvider)
router.put(apiRouter[1], requireAuth, updateFinancialProvider)
router.delete(apiRouter[1], requireAuth, deleteFinancialProvider)
// MAIN //

export default router