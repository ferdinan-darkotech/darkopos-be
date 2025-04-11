import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetNotificationTemplates, srvGetNotificationTemplateById, srvGetNotificationTemplateByCode,
  srvNotificationTemplateExist, srvCreateNotificationTemplate, srvUpdateNotificationTemplate, srvDeleteNotificationTemplate }
  from '../../../services/v2/notification/srvNotificationTemplate.js'
import { extractTokenProfile } from '../../../services/v1/securityService'

// Get Notification Templates
const getNotificationTemplates = function (req, res, next, filter = false, comment = 'getNotificationTemplates') {
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

  srvGetNotificationTemplates(req.query, filter).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: type.count,
      data: type.rows
    })
  }).catch(err => next(new ApiError(422, `ZCNP-00001: Couldn't find Notification Templates`, err)))
}

// Get General Notification Templates
exports.getNotificationTemplatesGeneral = function (req, res, next) {
  getNotificationTemplates(req, res, next, false, 'getNotificationTemplatesGeneral')
}

// Get Filtered NotificationTemplates
exports.getNotificationTemplatesFilter = function (req, res, next) {
  getNotificationTemplates(req, res, next, true, 'getNotificationTemplatesFilter')
}

// Get A Notification Template By Code
exports.getNotificationTemplateByCode = function (req, res, next) {
  console.log('Requesting-getNotificationTemplateByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetNotificationTemplateByCode(code, req.query).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: type
    })
  }).catch(err => next(new ApiError(422,`ZCNP-00002: Couldn't find Notification Template`, err)))
}

// Create a Notification Template
exports.insertNotificationTemplate = function (req, res, next) {
  console.log('Requesting-insertNotificationTemplate: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateNotificationTemplate(data, userLogIn.userid, next).then((created) => {
    return srvGetNotificationTemplateById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Notification Template ${result.code} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCNP-00003: Couldn't create Notification Template ${data.name} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCNP-00004: Couldn't find Notification Template ${data.name}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCNP-00005: Couldn't create Notification Template ${data.name}.`, err)))
}

//Update a Notification Template
exports.updateNotificationTemplate = function (req, res, next) {
  console.log('Requesting-updateNotificationTemplate: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvNotificationTemplateExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateNotificationTemplate(data, userLogIn.userid, next).then((updated) => {
        return srvGetNotificationTemplateByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Notification Template ${result.code} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCNP-00007: Couldn't update Notification Template ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCNP-00008: Couldn't update Notification Template ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCNP-00009: Couldn't find Notification Template ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCNP-00010: Couldn't find Notification Template ${data.code} .`, err)))
}

// //Delete a Notification Template
exports.deleteNotificationTemplate = function (req, res, next) {
  console.log('Requesting-deleteNotificationTemplate: ' + req.url + ' ...')
  const code  = req.params.code
  srvNotificationTemplateExist(code).then(exists => {
    if (exists) {
      srvDeleteNotificationTemplate(code, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Notification Template ${code} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCNP-00011: Couldn't delete Notification Template ${code}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCNP-00012: Couldn't delete Notification Template ${code}.`, err)))
    } else {
      next(new ApiError(422, `ZCNP-00013: Notification Template ${code} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCNP-00014: Notification Template ${code} not exists.`, err)))
}
