/**
 * Created by  pa nda .ha s . my .id on 2018-06-10.
 */
import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  srvSetCashierInfo, srvCashierIdExists, countData,
  srvGetUserCashierById, srvGetUserCashiers,
  srvCreateUserCashier, srvUpdateUserCashier, srvDeleteUserCashier,
  srvGetUserCashierPeriods, srvGetUserCashierPeriodByStatus,
  srvGetUserCashierPeriodByStore, srvGetUserCashierPeriodByStoreStatus,
  srvGetUserCashiersV2
} from '../../services/cashier/userService'
import { srvGetStoreCashRegisterActivate } from '../../services/cashier/cashRegisterService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Retrieve a user cashier
exports.getUserCashier = function (req, res, next) {
  console.log('Requesting-getUserCashier: ' + req.url + ' ...')
  const id = req.params.id
  srvGetUserCashierById(id).then((cashier) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: cashier
    })
  }).catch(err => next(new ApiError(404, `ZCUC-00001: Couldn't find User ${id}.`, err)))
}

// Retrieve list of user cashier periods
exports.getUserCashierPeriods = function (req, res, next) {
  console.log('Requesting-getUserCashierPeriods: ' + req.url + ' ...')
  const cashierId = req.params.cashierid
  let { pageSize, page, order, ...other } = req.query
  const pagination = { pageSize, page, order }
  srvGetUserCashierPeriods(cashierId, other, pagination).then((cashier) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: cashier
    })
  }).catch(err => next(new ApiError(404, `ZCUC-00015: Couldn't find User ${id}.`, err)))
}

// Retrieve a user cashier period by status
exports.getUserCashierPeriodByStatus = function (req, res, next) {
  console.log('Requesting-getUserCashierPeriodByStatus: ' + req.url + ' ...')
  const { ...params } = req.params
  let { pageSize, page, order, ...other } = req.query
  const pagination = { pageSize, page, order }
  srvGetUserCashierPeriodByStatus(params, other, pagination).then((cashiers) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: pageSize || 10,
      page: page || 1,
      total: cashiers.length,
      data: cashiers
    })
  }).catch(err => next(new ApiError(404, `ZCUC-00016: Couldn't find User ${id}.`, err)))
}

// Retrieve a user cashier period by store
exports.getUserCashierPeriodByStore = function (req, res, next) {
  console.log('Requesting-getUserCashierPeriodByStore: ' + req.url + ' ...')
  const { ...params } = req.params
  let { pageSize, page, order, ...other } = req.query
  const pagination = { pageSize, page, order }
  let query = {}
  if (other.period) query = { period: other.period.split(',') }

  srvGetUserCashierPeriodByStore(params, query, pagination).then((cashiers) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: pageSize || 10,
      page: page || 1,
      total: cashiers.length,
      data: cashiers
    })
  }).catch(err => next(new ApiError(404, `ZCUC-00017: Couldn't find Cashier Period for ${params.storeid}.`, err)))
}

// Retrieve a user cashier period by store-status
exports.getUserCashierPeriodByStoreStatus = function (req, res, next) {
  console.log('Requesting-getUserCashierPeriodByStoreStatus: ' + req.url + ' ...')
  const { ...params } = req.params
  let { pageSize, page, order, ...other } = req.query
  const pagination = { pageSize, page, order }
  let query = {}
  if (other.period) query = { period: other.period.split(',') }
  srvGetStoreCashRegisterActivate(params.storeid).then((result) => {
    if (Number(result.isActivate)) {
      return srvGetUserCashierPeriodByStoreStatus(params, query, pagination, 'all').then((cashiers) => {
        const tmpCashier = JSON.parse(JSON.stringify(cashiers)).map(element => { 
          return {
            ...element,
            cashActive: result.isActivate
          }
        })
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          pageSize: pageSize || 10,
          page: page || 1,
          total: tmpCashier ? tmpCashier.length : 0,
          data: tmpCashier
        })
      }).catch(err => next(new ApiError(404, `ZCUC-00014: Couldn't find Cashier Period for ${params.storeid}.`, err)))
    } else {
      // next(new ApiError(409, `ZCUC-00018: 99|cash register periods is not activate`))
      return srvGetUserCashierPeriodByStoreStatus(params, query, pagination, 'one').then((cashiers) => {
        if (cashiers) cashiers.cashActive = result.isActivate
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          pageSize: pageSize || 10,
          page: page || 1,
          total: cashiers ? cashiers.length : 0,
          data: cashiers
        })
      }).catch(err => next(new ApiError(404, `ZCUC-00018: Couldn't find Cashier Period for ${params.storeid}.`, err)))
    }

  })
}

// Retrieve list of user cashier
exports.getUserCashiers = function (req, res, next) {
  console.log('Requesting-getUserCashiers: ' + req.url + ' ...')
  let { pageSize, page, order, ...other } = req.query
  const pagination = { pageSize, page, order }
  if(req.query.searchText) {
    countData(other, pagination).then((count) => {
      return srvGetUserCashiers(other, pagination).then((cashiers) => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          pageSize: pageSize || 10,
          page: page || 1,
          total: count,
          data: cashiers,
        })
      }).catch(err => next(new ApiError(404, `ZCUC-00002: Couldn't find Users.`, err)))
    }).catch(err => next(new ApiError(404, `COUNTZCUC-00002: Couldn't count Users.`, err)))
  } else {
    const newOps = {
      ...other,
      pageSize,
      page
    }
    return srvGetUserCashiersV2(newOps).then(rs => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: rs.count,
        data: rs.rows,
      })
    }).catch(err => next(new ApiError(404, `COUNTZCUC-00022: Couldn't find Users.`, err)))
  }
}

// Create a new cashier register
exports.insertUserCashier = function (req, res, next) {
  console.log('Requesting-insertUserCashier: ' + req.url + ' ...')
  const cashier = req.body
  const userLogIn = extractTokenProfile(req)
  srvCashierIdExists(cashier.id).then(exists => {
    if (exists) {
      next(new ApiError(409, `ZCUC-00003: Cashier ${cashier.id} already available.`))
    } else {
      srvCreateUserCashier(cashier, userLogIn.userid, next).then((created) => {
        srvGetUserCashierById(created.cashierId).then((results) => {
          const cashierInfo = srvSetCashierInfo(results)
          let jsonObj = {
            success: true,
            message: `Cashier ${cashierInfo.cashierId} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { cashier: cashierInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCUC-00004: Couldn't find cashier ${cashier.id}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCUC-00005: Couldn't create cashier ${cashier.id}.`, err)))
    }
  })
}

//Update a User
exports.updateUserCashier = function (req, res, next) {
  console.log('Requesting-updateUserCashier: ' + req.url + ' ...')
  const id = req.params.id
  let cashier = req.body
  const userLogIn = extractTokenProfile(req)
  srvCashierIdExists(id).then(exists => {
    if (exists) {
      return srvUpdateUserCashier(id, cashier, userLogIn.userid, next).then((updated) => {
        return srvGetUserCashierById(id).then((results) => {
          const cashierInfo = srvSetCashierInfo(results)
          let jsonObj = {
            success: true,
            message: `Cashier ${cashierInfo.cashierId} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { cashiers: cashierInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCUC-00006: Couldn't update User ${id}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCUC-00007: Couldn't update User ${id}.`, err)))
    } else {
      next(new ApiError(404, `ZCUC-00008: Couldn't find User ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `ZCUC-00009: Couldn't find User ${id}.`, err)))
}

//Delete a User Cashier
exports.deleteUserCashier = function (req, res, next) {
  console.log('Requesting-deleteUserCashier: ' + req.url + ' ...')
  const id = req.params.id
  srvCashierIdExists(id).then(exists => {
    if (exists) {
      return srvDeleteUserCashier(id, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Cashier ${id} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { cashiers: deleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCUC-00010: Couldn't delete User ${id}.`))
        }
      }).catch(err => next(new ApiError(422, `ZCUC-00011: Couldn't delete Cashier ${id}}.`, err)))
    } else {
      next(new ApiError(422, `ZCUC-00012: Cashier ${id} not available.`))
    }
  }).catch(err => next(new ApiError(422, `ZCUC-00013: Cashier ${id} not available.`, err)))
}