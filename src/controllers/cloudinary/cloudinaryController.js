import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  uploadImage
} from '../../services/cloudinary/cloudinaryService'
import { extractTokenProfile } from '../../services/v1/securityService'

// uploadImage
exports.uploadImage = function (req, res, next) {
  console.log('Requesting-uploadImage: ' + req.url + ' ...')
  return uploadImage(req, res, next)
}
