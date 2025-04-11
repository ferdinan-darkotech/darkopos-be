import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { getTransferOut, getTransferIn, getTransferInTransit } from '../../services/Report/transferReportService'
import { validationProcess } from '../../services/Report/processLog'
// Insert new mobile member
// Select a mobile booking
exports.getTransferOut = function (req, res, next) {
  console.log('Requesting-getTransferOut: ' + req.url + ' ...')
  const querying = 'sp_mutasi_out'
  return validationProcess({ querying }).then(valid => {
    if(!valid) throw Error('Request has been overload, please wait !!!')
    else {
      return getTransferOut(req.query, next).then(data => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          total: data.length,
          data: data
        })
      }).catch(err => next(new ApiError(422, `RT-00001: Couldn't find report.`, err)))
    }
  }).catch(err => next(new ApiError(422, `RT-00001: Couldn't find report.`, err)))
}

exports.getTransferIn = function (req, res, next) {
  console.log('Requesting-getTransferIn01: ' + req.url + ' ...')
  getTransferIn(req.query, next).then(data => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: data.length,
      data: data
    })
  }).catch(err => next(new ApiError(422, `RT-00002: Couldn't find report.`, err)))
}

// from transfer out
exports.getTransferInTransfer = function (req, res, next) {
  console.log('Requesting-getTransferIn02: ' + req.url + ' ...')
  getTransferIn(req.query, next).then(data => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: data.length,
      data: data
    })
  }).catch(err => next(new ApiError(422, `RT-00003: Couldn't find report.`, err)))
}

// from transfer in
exports.getTransferInTransit = function (req, res, next) {
  console.log('Requesting-getTransferInTransit: ' + req.url + ' ...')
  getTransferInTransit(req.query, next).then(data => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: data.length,
      data: data
    })
  }).catch(err => next(new ApiError(422, `RT-00003: Couldn't find report.`, err)))
}
