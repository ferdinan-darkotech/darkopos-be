import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetNotificationLogs, srvGetNotificationLogById, srvGetNotificationLogByCode,
  srvNotificationLogExist, srvCreateNotificationLog, srvUpdateNotificationLog, srvDeleteNotificationLog }
  from '../../../services/v2/notification/srvNotificationLog.js'
import { extractTokenProfile } from '../../../services/v1/securityService'

// Get Notification Logs
const getNotificationLogs = function (req, res, next, filter = false, comment = 'getNotificationLogs') {
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

  srvGetNotificationLogs(req.query, filter).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: type.count,
      data: type.rows
    })
  }).catch(err => next(new ApiError(422, `ZCNL-00001: Couldn't find Notification Logs`, err)))
}

// Get General Notification Logs
exports.getNotificationLogsGeneral = function (req, res, next) {
  getNotificationLogs(req, res, next, false, 'getNotificationLogsGeneral')
}

// Get Filtered NotificationLogs
exports.getNotificationLogsFilter = function (req, res, next) {
  getNotificationLogs(req, res, next, true, 'getNotificationLogsFilter')
}

// not use, code not unique
// // Get A Notification Log By Code
// exports.getNotificationLogByCode = function (req, res, next) {
//   console.log('Requesting-getNotificationLogByCode: ' + JSON.stringify(req.params) + ' ...')
//   let { code } = req.params
//   srvGetNotificationLogByCode(code, req.query).then((type) => {
//     res.xstatus(200).json({
//       success: true,
//       message: 'Ok',
//       data: type
//     })
//   }).catch(err => next(new ApiError(422,`ZCNL-00002: Couldn't find Notification Log`, err)))
// }

// Get A Notification Log By Id
exports.getNotificationLogById = function (req, res, next) {
  console.log('Requesting-getNotificationLogById: ' + JSON.stringify(req.params) + ' ...')
  let { id } = req.params
  srvGetNotificationLogById(id, req.query).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: type
    })
  }).catch(err => next(new ApiError(422,`ZCNL-00002: Couldn't find Notification Log`, err)))
}

// Create a Notification Log
exports.insertNotificationLog = function (req, res, next) {
  console.log('Requesting-insertNotificationLog: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateNotificationLog(data, userLogIn.userid, next).then((created) => {
    return srvGetNotificationLogById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Notification Log ${result.id} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCNL-00003: Couldn't create Notification Log ${data.name} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCNL-00004: Couldn't find Notification Log ${data.name}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCNL-00005: Couldn't create Notification Log ${data.name}.`, err)))
}

//Update a Notification Log
exports.updateNotificationLog = function (req, res, next) {
  console.log('Requesting-updateNotificationLog: ' + req.url + ' ...')
  let data = req.body
  data.id = req.params.id
  const userLogIn = extractTokenProfile(req)
  srvNotificationLogExist(data.id).then(exists => {
    if (exists) {
      return srvUpdateNotificationLog(data, userLogIn.userid, next).then((updated) => {
        return srvGetNotificationLogById(data.id).then((result) => {
          let jsonObj = {
            success: true,
            message: `Notification Log ${result.id} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCNL-00007: Couldn't update Notification Log ${data.id}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCNL-00008: Couldn't update Notification Log ${data.id}.`, err)))
    } else {
      next(new ApiError(422, `ZCNL-00009: Couldn't find Notification Log ${data.id} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCNL-00010: Couldn't find Notification Log ${data.id} .`, err)))
}

// //Delete a Notification Log
exports.deleteNotificationLog = function (req, res, next) {
  console.log('Requesting-deleteNotificationLog: ' + req.url + ' ...')
  const id  = req.params.id
  srvNotificationLogExist(id).then(exists => {
    if (exists) {
      srvDeleteNotificationLog(id, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Notification Log ${id} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCNL-00011: Couldn't delete Notification Log ${id}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCNL-00012: Couldn't delete Notification Log ${id}.`, err)))
    } else {
      next(new ApiError(422, `ZCNL-00013: Notification Log ${id} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCNL-00014: Notification Log ${id} not exists.`, err)))
}
