import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetJobRoles, srvGetJobRoleById, srvGetJobRoleByCode, srvJobRoleExist,
  srvCreateJobRole, srvUpdateJobRole, srvDeleteJobRole }
  from '../../../../services/v2/master/humanresource/srvJobRole'
import { extractTokenProfile } from '../../../../services/v1/securityService'

// Get Job Roles
const getJobRoles = function (req, res, next, filter = false, comment = 'getJobRoles') {
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

  srvGetJobRoles(req.query, filter).then((jobrole) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: jobrole.count,
      data: jobrole.rows
    })
  }).catch(err => next(new ApiError(422, `ZCJR-00001: Couldn't find Job Roles`, err)))
}

// Get General Job Roles
exports.getJobRolesGeneral = function (req, res, next) {
  getJobRoles(req, res, next, false, 'getJobRolesGeneral')
}

// Get Filtered Job Roles
exports.getJobRolesFilter = function (req, res, next) {
  getJobRoles(req, res, next, true, 'getJobRolesFilter')
}

// Get A Job Role By Code
exports.getJobRoleByCode = function (req, res, next) {
  console.log('Requesting-getJobRoleByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetJobRoleByCode(code, req.query).then((jobrole) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: jobrole
    })
  }).catch(err => next(new ApiError(422,`ZCJR-00002: Couldn't find Job Role`, err)))
}

// Create a Job Role
exports.insertJobRole = function (req, res, next) {
  console.log('Requesting-insertJobRole: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateJobRole(data, userLogIn.userid, next).then((created) => {
    return srvGetJobRoleById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Job Role ${result.positionCode} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCJR-00003: Couldn't create Job Role ${data.positionName} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCJR-00004: Couldn't find Job Role ${data.positionName}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCJR-00005: Couldn't create Job Role ${data.positionName}.`, err)))
}

//Update a Job Role
exports.updateJobRole = function (req, res, next) {
  console.log('Requesting-updateJobRole: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvJobRoleExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateJobRole(data, userLogIn.userid, next).then((updated) => {
        return srvGetJobRoleByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Job Role ${result.positionCode} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCJR-00007: Couldn't update Job Role ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCJR-00008: Couldn't update Job Role ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCJR-00009: Couldn't find Job Role ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCJR-00010: Couldn't find Job Role ${data.code} .`, err)))
}

// //Delete a Job Role
exports.deleteJobRole = function (req, res, next) {
  console.log('Requesting-deleteJobRole: ' + req.url + ' ...')
  const positionCode  = req.params.code
  srvJobRoleExist(positionCode).then(exists => {
    if (exists) {
      srvDeleteJobRole(positionCode, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Job Role ${positionCode} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCJR-00011: Couldn't delete Job Role ${positionCode}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCJR-00012: Couldn't delete Job Role ${positionCode}.`, err)))
    } else {
      next(new ApiError(422, `ZCJR-00013: Job Role ${positionCode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCJR-00014: Job Role ${positionCode} not exists.`, err)))
}
