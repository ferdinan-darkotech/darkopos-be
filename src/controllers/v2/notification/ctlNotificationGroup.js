import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetNotificationGroups, srvGetNotificationGroupById, srvGetNotificationGroupByCode,
  srvNotificationGroupExist, srvCreateNotificationGroup, srvUpdateNotificationGroup, srvDeleteNotificationGroup }
  from '../../../services/v2/notification/srvNotificationGroup.js'
import { extractTokenProfile } from '../../../services/v1/securityService'

// Get Notification Groups
const getNotificationGroups = function (req, res, next, filter = false, comment = 'getNotificationGroups') {
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

  srvGetNotificationGroups(req.query, filter).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: type.count,
      data: type.rows
    })
  }).catch(err => next(new ApiError(422, `ZCNG-00001: Couldn't find Notification Groups`, err)))
}

// Get General Notification Groups
exports.getNotificationGroupsGeneral = function (req, res, next) {
  getNotificationGroups(req, res, next, false, 'getNotificationGroupsGeneral')
}

// Get Filtered NotificationGroups
exports.getNotificationGroupsFilter = function (req, res, next) {
  getNotificationGroups(req, res, next, true, 'getNotificationGroupsFilter')
}

// Get A Notification Group By Code
exports.getNotificationGroupByCode = function (req, res, next) {
  console.log('Requesting-getNotificationGroupByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetNotificationGroupByCode(code, req.query).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: type
    })
  }).catch(err => next(new ApiError(422,`ZCNG-00002: Couldn't find Notification Group`, err)))
}

// Create a Notification Group
exports.insertNotificationGroup = function (req, res, next) {
  console.log('Requesting-insertNotificationGroup: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateNotificationGroup(data, userLogIn.userid, next).then((created) => {
    return srvGetNotificationGroupById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Notification Group ${result.code} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCNG-00003: Couldn't create Notification Group ${data.name} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCNG-00004: Couldn't find Notification Group ${data.name}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCNG-00005: Couldn't create Notification Group ${data.name}.`, err)))
}

//Update a Notification Group
exports.updateNotificationGroup = function (req, res, next) {
  console.log('Requesting-updateNotificationGroup: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvNotificationGroupExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateNotificationGroup(data, userLogIn.userid, next).then((updated) => {
        return srvGetNotificationGroupByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Notification Group ${result.code} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCNG-00007: Couldn't update Notification Group ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCNG-00008: Couldn't update Notification Group ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCNG-00009: Couldn't find Notification Group ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCNG-00010: Couldn't find Notification Group ${data.code} .`, err)))
}

// //Delete a Notification Group
exports.deleteNotificationGroup = function (req, res, next) {
  console.log('Requesting-deleteNotificationGroup: ' + req.url + ' ...')
  const code  = req.params.code
  srvNotificationGroupExist(code).then(exists => {
    if (exists) {
      srvDeleteNotificationGroup(code, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Notification Group ${code} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCNG-00011: Couldn't delete Notification Group ${code}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCNG-00012: Couldn't delete Notification Group ${code}.`, err)))
    } else {
      next(new ApiError(422, `ZCNG-00013: Notification Group ${code} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCNG-00014: Notification Group ${code} not exists.`, err)))
}
