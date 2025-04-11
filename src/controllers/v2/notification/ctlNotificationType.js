import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetNotificationTypes, srvGetNotificationTypeById, srvGetNotificationTypeByCode,
  srvNotificationTypeExist, srvCreateNotificationType, srvUpdateNotificationType, srvDeleteNotificationType }
  from '../../../services/v2/notification/srvNotificationType.js'
import { extractTokenProfile } from '../../../services/v1/securityService'

// Get Notification Types
const getNotificationTypes = function (req, res, next, filter = false, comment = 'getNotificationTypes') {
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

  srvGetNotificationTypes(req.query, filter).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: type.count,
      data: type.rows
    })
  }).catch(err => next(new ApiError(422, `ZCNT-00001: Couldn't find Notification Types`, err)))
}

// Get General Notification Types
exports.getNotificationTypesGeneral = function (req, res, next) {
  getNotificationTypes(req, res, next, false, 'getNotificationTypesGeneral')
}

// Get Filtered NotificationTypes
exports.getNotificationTypesFilter = function (req, res, next) {
  getNotificationTypes(req, res, next, true, 'getNotificationTypesFilter')
}

// Get A Notification Type By Code
exports.getNotificationTypeByCode = function (req, res, next) {
  console.log('Requesting-getNotificationTypeByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetNotificationTypeByCode(code, req.query).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: type
    })
  }).catch(err => next(new ApiError(422,`ZCNT-00002: Couldn't find Notification Type`, err)))
}

// Create a Notification Type
exports.insertNotificationType = function (req, res, next) {
  console.log('Requesting-insertNotificationType: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateNotificationType(data, userLogIn.userid, next).then((created) => {
    return srvGetNotificationTypeById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Notification Type ${result.code} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCNT-00003: Couldn't create Notification Type ${data.name} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCNT-00004: Couldn't find Notification Type ${data.name}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCNT-00005: Couldn't create Notification Type ${data.name}.`, err)))
}

//Update a Notification Type
exports.updateNotificationType = function (req, res, next) {
  console.log('Requesting-updateNotificationType: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvNotificationTypeExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateNotificationType(data, userLogIn.userid, next).then((updated) => {
        return srvGetNotificationTypeByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Notification Type ${result.code} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCNT-00007: Couldn't update Notification Type ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCNT-00008: Couldn't update Notification Type ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCNT-00009: Couldn't find Notification Type ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCNT-00010: Couldn't find Notification Type ${data.code} .`, err)))
}

// //Delete a Notification Type
exports.deleteNotificationType = function (req, res, next) {
  console.log('Requesting-deleteNotificationType: ' + req.url + ' ...')
  const code  = req.params.code
  srvNotificationTypeExist(code).then(exists => {
    if (exists) {
      srvDeleteNotificationType(code, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Notification Type ${code} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCNT-00011: Couldn't delete Notification Type ${code}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCNT-00012: Couldn't delete Notification Type ${code}.`, err)))
    } else {
      next(new ApiError(422, `ZCNT-00013: Notification Type ${code} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCNT-00014: Notification Type ${code} not exists.`, err)))
}
