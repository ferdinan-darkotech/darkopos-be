import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { getDateTime } from '../../services/setting/timeService'

// Insert new mobile member
// Select a mobile booking
exports.getDateTime = function (req, res, next) {
  console.log('Requesting-getDateTime: ' + req.url + ' ...')
  getDateTime(req.params.id, next).then(data => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: data
    })
  }).catch(err => next(new ApiError(422, `ZT-00001: Couldn't timezone.`, err)))
}
