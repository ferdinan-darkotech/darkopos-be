import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { getCitiesGeneral, getCitiesFilter, getCityByCode, insertCity, updateCity, deleteCity }
  from '../../../../controllers/v2/master/general/ctlCity'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/cities'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getCitiesGeneral)
router.get(apiRouter[1], requireAuth, getCitiesFilter)
router.get(apiRouter[2], requireAuth, getCityByCode)
router.post(apiRouter[0], requireAuth, insertCity)
router.put(apiRouter[2], requireAuth, updateCity)
router.delete(apiRouter[2], requireAuth, deleteCity)
// MAIN //

export default router