import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetCustomerTypes, srvGetCustomerTypeById, srvGetCustomerTypeByCode, srvCustomerTypeExist,
  srvCreateCustomerType, srvUpdateCustomerType, srvDeleteCustomerType }
  from '../../../../services/v2/master/customer/srvCustomerType'
import { extractTokenProfile } from '../../../../services/v1/securityService'

// Get Customer Types
const getCustomerTypes = function (req, res, next, filter = false, comment = 'getCustomerTypes') {
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

  srvGetCustomerTypes(req.query, filter).then((customertype) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: customertype.count,
      data: customertype.rows
    })
  }).catch(err => next(new ApiError(422, `ZCCT-00001: Couldn't find Customer Types`, err)))
}

// Get General Customer Types
exports.getCustomerTypesGeneral = function (req, res, next) {
  getCustomerTypes(req, res, next, false, 'getCustomerTypesGeneral')
}

// Get Filtered Customer Types
exports.getCustomerTypesFilter = function (req, res, next) {
  getCustomerTypes(req, res, next, true, 'getCustomerTypesFilter')
}

// Get A Customer Type By Code
exports.getCustomerTypeByCode = function (req, res, next) {
  console.log('Requesting-getCustomerTypeByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetCustomerTypeByCode(code, req.query).then((customertype) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: customertype
    })
  }).catch(err => next(new ApiError(422,`ZCCT-00002: Couldn't find Customer Type`, err)))
}

// Create a Customer Type
exports.insertCustomerType = function (req, res, next) {
  console.log('Requesting-insertCustomerType: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateCustomerType(data, userLogIn.userid, next).then((created) => {
    return srvGetCustomerTypeById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Customer Type ${result.typeCode} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCCT-00003: Couldn't create Customer Type ${data.typeName} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCCT-00004: Couldn't find Customer Type ${data.typeName}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCCT-00005: Couldn't create Customer Type ${data.typeName}.`, err)))
}

//Update a Customer Type
exports.updateCustomerType = function (req, res, next) {
  console.log('Requesting-updateCustomerType: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvCustomerTypeExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateCustomerType(data, userLogIn.userid, next).then((updated) => {
        return srvGetCustomerTypeByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Customer Type ${result.typeCode} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCCT-00007: Couldn't update Customer Type ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCCT-00008: Couldn't update Customer Type ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCCT-00009: Couldn't find Customer Type ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCCT-00010: Couldn't find Customer Type ${data.code} .`, err)))
}

// //Delete a Customer Type
exports.deleteCustomerType = function (req, res, next) {
  console.log('Requesting-deleteCustomerType: ' + req.url + ' ...')
  const typeCode  = req.params.code
  srvCustomerTypeExist(typeCode).then(exists => {
    if (exists) {
      srvDeleteCustomerType(typeCode, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Customer Type ${typeCode} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCCT-00011: Couldn't delete Customer Type ${typeCode}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCCT-00012: Couldn't delete Customer Type ${typeCode}.`, err)))
    } else {
      next(new ApiError(422, `ZCCT-00013: Customer Type ${typeCode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCCT-00014: Customer Type ${typeCode} not exists.`, err)))
}
