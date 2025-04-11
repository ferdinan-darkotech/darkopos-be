import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetCustomers, srvGetCustomerById, srvGetCustomerByCode, srvCustomerExist,
  srvCreateCustomer, srvUpdateCustomer, srvDeleteCustomer }
  from '../../../../services/v2/master/customer/srvCustomerList'
import { srvGetCustomerCashbackByCode } from '../../../../services/v2/master/customer/srvCustomerCashback'
import { extractTokenProfile } from '../../../../services/v1/securityService'

// Get Customer Cashback
const getCustomers = function (req, res, next, filter = false, comment = 'getCustomers') {
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

  srvGetCustomers(req.query, filter).then((customer) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: customer.count,
      data: customer.rows
    })
  }).catch(err => next(new ApiError(422, `ZCCL-00001: Couldn't find Customers`, err)))
}

// Get General Customers
exports.getCustomersGeneral = function (req, res, next) {
  getCustomers(req, res, next, false, 'getCustomersGeneral')
}

// Get Filtered Customers
exports.getCustomersFilter = function (req, res, next) {
  getCustomers(req, res, next, true, 'getCustomersFilter')
}

// Get A Customer By Code
exports.getCustomerByCode = function (req, res, next) {
  console.log('Requesting-getCustomerByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetCustomerByCode(code, req.query).then((customer) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: customer
    })
  }).catch(err => next(new ApiError(422,`ZCCL-00002: Couldn't find Customer`, err)))
}

// Create a Customer
exports.insertCustomer = function (req, res, next) {
  console.log('Requesting-insertCustomer01: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateCustomer(data, userLogIn.userid, next).then((created) => {
    if (created) {
      return srvGetCustomerById(created.id).then((result) => {
        if (result) {
          let jsonObj = {
            success: true,
            message: `Customer ${result.memberCode} created`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCCL-00003: Couldn't create Customer ${data.memberCode} .`))
        }
      }).catch(err => next(new ApiError(422, `ZCCL-00004: Couldn't find Customer ${data.memberCode}.`, err)))
    } else {
      next(new ApiError(422, `ZCCL-00003x: Couldn't create Customer ${data.memberCode} .`))
    }
  })
  // .catch(err => next(new ApiError(422, `ZCCL-00005: Couldn't create Customer ${data.memberCode}.`, err)))
}

//Update a Customer
exports.updateCustomer = function (req, res, next) {
  console.log('Requesting-updateCustomer: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)

  srvCustomerExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateCustomer(data, userLogIn.userid, next).then((updated) => {
        return srvGetCustomerByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Customer ${result.memberCode} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCCL-00007: Couldn't update Customer ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCCL-00008: Couldn't update Customer ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCCL-00009: Couldn't find Customer ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCCL-00010: Couldn't find Customer ${data.code} .`, err)))
}

// //Delete a Customer
exports.deleteCustomer = function (req, res, next) {
  console.log('Requesting-deleteCustomer: ' + req.url + ' ...')
  const memberCode  = req.params.code
  srvCustomerExist(memberCode).then(exists => {
    if (exists) {
      srvDeleteCustomer(memberCode, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Customer ${memberCode} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCCL-00011: Couldn't delete Customer ${memberCode}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCCL-00012: Couldn't delete Customer ${memberCode}.`, err)))
    } else {
      next(new ApiError(422, `ZCCL-00013: Customer ${memberCode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCCL-00014: Customer ${memberCode} not exists.`, err)))
}

exports.getCustomerCashbackByCode = function (req, res, next) {
  console.log('Requesting-getCustomerCashbackByCode: ' + req.url + ' ...')
  srvGetCustomerCashbackByCode(req.params.code, next).then((cashback) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: cashback
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Customer ${req.params.code} Cashback.`, err)))
}