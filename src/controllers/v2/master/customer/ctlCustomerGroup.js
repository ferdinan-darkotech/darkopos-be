import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetCustomerGroups, srvGetCustomerGroupById, srvGetCustomerGroupByCode, srvCustomerGroupExist,
  srvCreateCustomerGroup, srvUpdateCustomerGroup, srvDeleteCustomerGroup }
  from '../../../../services/v2/master/customer/srvCustomerGroup'
import { extractTokenProfile } from '../../../../services/v1/securityService'

// Get Customer Groups
const getCustomerGroups = function (req, res, next, filter = false, comment = 'getCustomerGroups') {
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

  srvGetCustomerGroups(req.query, filter).then((customergroup) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: customergroup.count,
      data: customergroup.rows
    })
  }).catch(err => next(new ApiError(422, `ZCCG-00001: Couldn't find Customer Groups`, err)))
}

// Get General Customer Groups
exports.getCustomerGroupsGeneral = function (req, res, next) {
  getCustomerGroups(req, res, next, false, 'getCustomerGroupsGeneral')
}

// Get Filtered Customer Groups
exports.getCustomerGroupsFilter = function (req, res, next) {
  getCustomerGroups(req, res, next, true, 'getCustomerGroupsFilter')
}

// Get A Customer Group By Code
exports.getCustomerGroupByCode = function (req, res, next) {
  console.log('Requesting-getCustomerGroupByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetCustomerGroupByCode(code, req.query).then((customergroup) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: customergroup
    })
  }).catch(err => next(new ApiError(422,`ZCCG-00002: Couldn't find Customer Group`, err)))
}

// Create a Customer Group
exports.insertCustomerGroup = function (req, res, next) {
  console.log('Requesting-insertCustomerGroup:' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateCustomerGroup(data, userLogIn.userid, next).then((created) => {
    return srvGetCustomerGroupById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Customer Group ${result.groupCode} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCCG-00003: Couldn't create Customer Group ${data.groupName} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCCG-00004: Couldn't find Customer Group ${data.groupName}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCCG-00005: Couldn't create Customer Group ${data.groupName}.`, err)))
}

//Update a Customer Group
exports.updateCustomerGroup = function (req, res, next) {
  console.log('Requesting-updateCustomerGroup: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  return srvCustomerGroupExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateCustomerGroup(data, userLogIn.userid, next).then((updated) => {
        return srvGetCustomerGroupByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Customer Group ${result.groupCode} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCCG-00007: Couldn't update Customer Group ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCCG-00008: Couldn't update Customer Group ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCCG-00009: Couldn't find Customer Group ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCCG-00010: Couldn't find Customer Group ${data.code} .`, err)))
}

// //Delete a Customer Group
exports.deleteCustomerGroup = function (req, res, next) {
  console.log('Requesting-deleteCustomerGroup: ' + req.url + ' ...')
  const groupCode  = req.params.code
  srvCustomerGroupExist(groupCode).then(exists => {
    if (exists) {
      srvDeleteCustomerGroup(groupCode, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Customer Group ${groupCode} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCCG-00011: Couldn't delete Customer Group ${groupCode}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCCG-00012: Couldn't delete Customer Group ${groupCode}.`, err)))
    } else {
      next(new ApiError(422, `ZCCG-00013: Customer Group ${groupCode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCCG-00014: Customer Group ${groupCode} not exists.`, err)))
}
