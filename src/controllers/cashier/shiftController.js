/**
 * Created by  pa n da .h as .m y .id on 2018-06-08.
 */
import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  srvSetShiftInfo, srvShiftNameExists, countData, srvShiftIdExists,
  srvGetShiftByName, srvGetShiftById, srvGetShifts,
  srvCreateShift, srvUpdateShift, srvDeleteShift
} from '../../services/cashier/shiftService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Retrieve list a shift
exports.getShift = function (req, res, next) {
  console.log('Requesting-getShift: ' + req.url + ' ...')
  const shiftId = req.params.id
  srvGetShiftById(shiftId).then((shift) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: shift
    })
  }).catch(err => next(new ApiError(404, `ZCSC-00001: Couldn't find Shift ${shiftId}.`, err)))
}

// Retrieve list of shifts
exports.getShifts = function (req, res, next) {
  console.log('Requesting-getShifts: ' + req.url + ' ...')
  let { pageSize, page, order, ...other } = req.query
  const pagination = { pageSize, page, order }
  countData(other, pagination).then((count) => {
    return srvGetShifts(other, pagination).then((shifts) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: count,
        data: JSON.parse(JSON.stringify(shifts)),

      })
    }).catch(err => next(new ApiError(404, `ZCSC-00002: Couldn't find Shifts.`, err)))
  }).catch(err => next(new ApiError(404, `COUNTZCSC-00002: Couldn't count Counters.`, err)))
}

// Create a new shift
exports.insertShift = function (req, res, next) {
  console.log('Requesting-insertShift: ' + req.url + ' ...')
  const shift = req.body
  const userLogIn = extractTokenProfile(req)
  srvShiftNameExists(shift.name).then(exists => {
    if (exists) {
      next(new ApiError(409, `ZCSC-00003: Shift ${shift.name} already available.`))
    } else {
      srvCreateShift(shift, userLogIn.userid, next).then((created) => {
        srvGetShiftByName(created.shiftName).then((results) => {
          const shiftInfo = srvSetShiftInfo(results)
          let jsonObj = {
            success: true,
            message: `Shift ${shiftInfo.name} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { shift: shiftInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCSC-00004: Couldn't find shift ${shift.name}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCSC-00005: Couldn't create shift ${shift.name}.`, err)))
    }
  })
}

//Update a Shift
exports.updateShift = function (req, res, next) {
  console.log('Requesting-updateShift: ' + req.url + ' ...')
  const shiftId = req.params.id
  let shift = req.body
  const userLogIn = extractTokenProfile(req)
  srvShiftIdExists(shiftId).then(exists => {
    if (exists) {
      return srvUpdateShift(shiftId, shift, userLogIn.userid, next).then((updated) => {
        return srvGetShiftById(shiftId).then((results) => {
          const shiftInfo = srvSetShiftInfo(results)
          let jsonObj = {
            success: true,
            message: `Shift ${shiftInfo.name} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { shift: shiftInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCSC-00006: Couldn't update Shift ${shiftId}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCSC-00007: Couldn't update Shift ${shiftId}.`, err)))
    } else {
      next(new ApiError(404, `ZCSC-00008: Couldn't find Shift ${shiftId}.`))
    }
  }).catch(err => next(new ApiError(422, `ZCSC-00009: Couldn't find Shift ${shiftId}.`, err)))
}

//Delete a Shift
exports.deleteShift = function (req, res, next) {
  console.log('Requesting-deleteShift: ' + req.url + ' ...')
  const shiftId = req.params.id
  srvShiftIdExists(shiftId).then(exists => {
    if (exists) {
      return srvDeleteShift(shiftId, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Shift ${shiftId} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { shifts: deleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCSC-00010: Couldn't delete Shift ${shiftId}.`))
        }
      }).catch(err => next(new ApiError(422, `ZCSC-00011: Couldn't delete Shift ${shiftId}}.`, err)))
    } else {
      next(new ApiError(422, `ZCSC-00012: Shift ${shiftId} not available.`))
    }
  }).catch(err => next(new ApiError(422, `ZCSC-00013: Shift ${shiftId} not available.`, err)))
}