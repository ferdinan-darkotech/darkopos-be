import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getBrand, getBrands, insertBrand, updateBrand, deleteBrand, deleteBrands }
  from '../../../controllers/stockBrandController'

const router = express.Router()

const apiRoute = project.api_prefix + '/stocks/brands'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getBrand)

router.get(apiRouter[0], requireAuth, getBrands)

router.post(apiRouter[1], requireAuth, insertBrand)

router.put(apiRouter[1], requireAuth, updateBrand)

router.delete(apiRouter[1], requireAuth, deleteBrand)

router.delete(apiRouter[0], requireAuth, deleteBrands)
// MAIN //

export default router