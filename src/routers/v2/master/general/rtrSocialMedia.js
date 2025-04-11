import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
// import { getCitiesGeneral, getCitiesFilter, getCityByCode, insertCity, updateCity, deleteCity }
//   from '../../../../controllers/v2/master/general/ctlCity'
import { getSocialMediaGeneral, getSocialMediaFilter, getSocialMediaByCode, insertSocialMedia, updateSocialMedia, deleteSocialMedia }
  from '../../../../controllers/v2/master/general/ctlSocialMedia'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/social/media'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:code',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getSocialMediaGeneral)
router.get(apiRouter[1], requireAuth, getSocialMediaFilter)
router.get(apiRouter[2], requireAuth, getSocialMediaByCode)
router.post(apiRouter[0], requireAuth, insertSocialMedia)
router.put(apiRouter[2], requireAuth, updateSocialMedia)
router.delete(apiRouter[2], requireAuth, deleteSocialMedia)
// MAIN //

export default router