/**
 * Created by panda .has .my .id on 02/18/14.
 */
import project from '../../../config/project.config'
import { ApiError} from '../../services/v1/errorHandlingService'
import { srvMonthCounter, srvMonthList, srvMonthDateCounter, srvMonthDateList }
  from '../../services/member/memberBirthService'
import { extractTokenProfile } from '../../services/v1/securityService'

exports.getMonthCounter = function (req, res, next) {
  console.log('Requesting-getMonthCounter: ' + req.params.id + req.url + ' ...' )
  srvMonthCounter(req.body.month).then((counter) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: counter
    })
  }).catch(err => next(new ApiError(422, `Couldn't count for this month ${req.body.month}.`, err)))
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
