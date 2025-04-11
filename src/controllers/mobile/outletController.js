import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { getStoreQuery } from '../../services/mobile/outletService.js'

exports.getAllOutlet = function (req, res, next) {
  console.log('Requesting-getAllOutlet: ' + req.url + ' ...')
  getStoreQuery('', 'alloutlet').then((store) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      icode: 'STR1-05',
      data: store
    })
  }).catch(err => next(new ApiError(422, 'Something wrong', err)))
}