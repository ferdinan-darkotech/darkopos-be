import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getCarBrands, getCarModels, getCarTypes, getCarBrand, getCarModel, getCarType }
  from '../../../controllers/master/assetSpesification'

const router = express.Router()

const apiRoute = project.api_prefix + '/assets'
const apiRouteCar = apiRoute + '/cars'
const apiRouter = [
  apiRoute,
  apiRouteCar + '/brands',
  apiRouteCar + '/brands/:id/models',
  apiRouteCar + '/models/:id/types',
  apiRouteCar + '/brands/:id',
  apiRouteCar + '/models/:id',
  apiRouteCar + '/types/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getCarBrands)

router.get(apiRouter[2], requireAuth, getCarModels)

router.get(apiRouter[3], requireAuth, getCarTypes)

router.get(apiRouter[4], requireAuth, getCarBrand)

router.get(apiRouter[5], requireAuth, getCarModel)

router.get(apiRouter[6], requireAuth, getCarType)

// MAIN //

export default router