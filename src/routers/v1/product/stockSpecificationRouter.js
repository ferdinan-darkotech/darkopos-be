import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getDataId, getData, updateData, insertData, insertBulkData, deleteData }
  from '../../../controllers/product/stockSpecificationController'

const router = express.Router()

const apiRoute = project.api_prefix + '/stock/specificationstock'
const apiRoute2 = project.api_prefix + '/stock/specificationinsstock'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute2
]

// MAIN //
router.get(apiRouter[1], requireAuth, getDataId)

router.get(apiRouter[0], requireAuth, getData)

router.post(apiRouter[0], requireAuth, insertData)

router.post(apiRouter[2], requireAuth, insertBulkData)

router.put(apiRouter[1], requireAuth, updateData)

router.delete(apiRouter[1], requireAuth, deleteData)
// MAIN //

export default router