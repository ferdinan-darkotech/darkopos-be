import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getCity, getCityId, getCities, insertCity, updateCity, deleteCity, deleteCities }
  from '../../controllers/cityController'

const router = express.Router()

const apiRoute = project.api_prefix + '/cities'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/id/:id' ,
]

// MAIN //
router.get(apiRouter[1], requireAuth, getCity)

router.get(apiRouter[2], requireAuth, getCityId)

router.get(apiRouter[0], requireAuth, getCities)

router.post(apiRouter[1], requireAuth, insertCity)

router.put(apiRouter[1], requireAuth, updateCity)

router.delete(apiRouter[1], requireAuth, deleteCity)

router.delete(apiRouter[0], requireAuth, deleteCities)
// MAIN //

export default router