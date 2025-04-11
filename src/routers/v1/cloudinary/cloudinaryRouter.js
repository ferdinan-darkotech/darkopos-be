import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { uploadImage }
  from '../../../controllers/cloudinary/cloudinaryController'

const router = express.Router()

const apiRoute = project.api_prefix + '/upload'
const apiRouter = [
  apiRoute
]

// MAIN //
router.post(apiRouter[0], requireAuth, uploadImage)
// MAIN //

export default router