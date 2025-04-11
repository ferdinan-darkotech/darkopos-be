/**
 * Created by panda .h a s .m y .id on 2018-04-23.
 */
import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { srvMandatoryChecks, getServiceChecksUsage }
  from '../../services/service/checkService'

exports.getServiceChecks = function (req, res, next) {
  console.log('Requesting-getServiceChecks: ' + req.params.id + req.url + ' ...' )
  srvMandatoryChecks().then((result) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: result
    })
  }).catch(err => next(new ApiError(422, `Couldn't retrieve mandatory service check .`, err)))
}

exports.getServiceChecksUsage = function (req, res, next) {
  console.log('Requesting-getServiceChecksUsage: ' + req.params.id + req.url + ' ...')
  if (req.query.policeNo) {
    getServiceChecksUsage(req.query).then((result) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: (result || []).length,
        data: (result || [])
      })
    }).catch(err => next(new ApiError(422, `Couldn't find last Transaction .`, err)))
  } else {
    next(new ApiError(422, `params is not complete.`))
  }
}

exports.getMonthList = function (req, res, next) {
  console.log('Requesting-getMonthList: ' + req.params.id + req.url + ' ...' )
  srvMonthList(req.body.month).then((list) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: list
    })
  }).catch(err => next(new ApiError(422, `Couldn't count for this month ${req.body.month}.`, err)))
}

exports.getMonthDateCounter = function (req, res, next) {
  console.log('Requesting-getMonthDateCounter: ' + req.params.id + req.url + ' ...' )
  srvMonthDateCounter(req.body.month).then((counter) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: counter
    })
  }).catch(err => next(new ApiError(422, `Couldn't count for this month ${req.body.month}.`, err)))
}

exports.getMonthDateList = function (req, res, next) {
  console.log('Requesting-getMonthDateList: ' + req.params.id + req.url + ' ...' )
  srvMonthDateList(req.body.monthdate).then((list) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: list
    })
  }).catch(err => next(new ApiError(422, `Couldn't count for this month ${req.body.month}.`, err)))
}
