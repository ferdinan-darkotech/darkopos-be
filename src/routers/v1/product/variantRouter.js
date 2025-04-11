import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getDataId, getData, updateData, insertData, deleteData }
  from '../../../controllers/product/variantController'

const router = express.Router()

const apiRoute = project.api_prefix + '/stock/variant'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getDataId)

router.get(apiRouter[0], requireAuth, getData)

router.post(apiRouter[0], requireAuth, insertData)

router.put(apiRouter[1], requireAuth, updateData)

router.delete(apiRouter[1], requireAuth, deleteData)
// MAIN //

export default router