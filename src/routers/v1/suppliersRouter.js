import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getSupplier, getSuppliers, insertSupplier, updateSupplier, deleteSupplier, deleteSuppliers,
  getSupplierByCode, ctlGetAPISupplier }
  from '../../controllers/supplierController'

const router = express.Router()

const apiRoute = project.api_prefix + '/suppliers'
const apiRouteV2 = project.api_prefix_v2 + '/suppliers'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRouteV2 + '/ref-suppliers'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getSupplier)

router.get(apiRouter[0], requireAuth, getSuppliers)

router.post(apiRouter[1], requireAuth, insertSupplier)

router.put(apiRouter[1], requireAuth, updateSupplier)

router.delete(apiRouter[1], requireAuth, deleteSupplier)

router.delete(apiRouter[0], requireAuth, deleteSuppliers)

router.get(apiRouter[2], requireAuth, ctlGetAPISupplier)
// MAIN //

// OTHER //
// OTHER //

export default router