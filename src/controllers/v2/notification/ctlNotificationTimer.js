import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetNotificationTimers, srvGetNotificationTimerById, srvGetNotificationTimerByCode,
  srvNotificationTimerExist, srvCreateNotificationTimer, srvUpdateNotificationTimer, srvDeleteNotificationTimer }
  from '../../../services/v2/notification/srvNotificationTimer.js'
import { extractTokenProfile } from '../../../services/v1/securityService'

// Get Notification Timers
const getNotificationTimers = function (req, res, next, filter = false, comment = 'getNotificationTimers') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  let pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  }
  if (other && other.hasOwnProperty('m')) {
    const mode = other.m.split(',')
    if (['ar','lov'].some(_ => mode.includes(_))) pagination = {}
  }

  srvGetNotificationTimers(req.query, filter).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: type.count,
      data: type.rows
    })
  }).catch(err => next(new ApiError(422, `ZCNR-00001: Couldn't find Notification Timers`, err)))
}

// Get General Notification Timers
exports.getNotificationTimersGeneral = function (req, res, next) {
  getNotificationTimers(req, res, next, false, 'getNotificationTimersGeneral')
}

// Get Filtered NotificationTimers
exports.getNotificationTimersFilter = function (req, res, next) {
  getNotificationTimers(req, res, next, true, 'getNotificationTimersFilter')
}

// Get A Notification Timer By Code
exports.getNotificationTimerByCode = function (req, res, next) {
  console.log('Requesting-getNotificationTimerByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetNotificationTimerByCode(code, req.query).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: type
    })
  }).catch(err => next(new ApiError(422,`ZCNR-00002: Couldn't find Notification Timer`, err)))
}

// Create a Notification Timer
exports.insertNotificationTimer = function (req, res, next) {
  console.log('Requesting-insertNotificationTimer: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateNotificationTimer(data, userLogIn.userid, next).then((created) => {
    return srvGetNotificationTimerById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Notification Timer ${result.code} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCNR-00003: Couldn't create Notification Timer ${data.name} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCNR-00004: Couldn't find Notification Timer ${data.name}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCNR-00005: Couldn't create Notification Timer ${data.name}.`, err)))
}

//Update a Notification Timer
exports.updateNotificationTimer = function (req, res, next) {
  console.log('Requesting-updateNotificationTimer: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvNotificationTimerExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateNotificationTimer(data, userLogIn.userid, next).then((updated) => {
        return srvGetNotificationTimerByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Notification Timer ${result.code} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCNR-00007: Couldn't update Notification Timer ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCNR-00008: Couldn't update Notification Timer ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCNR-00009: Couldn't find Notification Timer ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCNR-00010: Couldn't find Notification Timer ${data.code} .`, err)))
}

// //Delete a Notification Timer
exports.deleteNotificationTimer = function (req, res, next) {
  console.log('Requesting-deleteNotificationTimer: ' + req.url + ' ...')
  const code  = req.params.code
  srvNotificationTimerExist(code).then(exists => {
    if (exists) {
      srvDeleteNotificationTimer(code, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Notification Timer ${code} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCNR-00011: Couldn't delete Notification Timer ${code}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCNR-00012: Couldn't delete Notification Timer ${code}.`, err)))
    } else {
      next(new ApiError(422, `ZCNR-00013: Notification Timer ${code} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCNR-00014: Notification Timer ${code} not exists.`, err)))
}
