/**
 * Created by  p a nd a .h as . my.i d on 2018-06-11.
 */
import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
import {
  srvCashRegisterExists, srvCashRegisterIdExists,
  srvGetCashRegisterById, srvGetCashRegisterByCols, srvGetCashRegisters,
  srvCreateCashRegister, srvUpdateCashRegister, srvSetCashRegisterInfo,
  srvGetPeriodStatus, srvCashRegisterActive, srvCashRegisterIdStatusExists,
  srvUpdateCashRegisterStatus, srvCreateCashRegisterLog,
  srvGetCashRegisterLogById, srvGetCashRegisterLogByLogId, srvCloseOtherCashRegister
} from '../../services/cashier/cashRegisterService'
import { extractTokenProfile } from '../../services/v1/securityService'
import moment from 'moment'

// Retrieve a cash register
exports.getCashRegister = function (req, res, next) {
  console.log('Requesting-getCashRegister: ' + req.url + ' ...')
  const id = req.params.id
  srvGetCashRegisterById(id).then((register) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: register
    })
  }).catch(err => next(new ApiError(404, `ZCRC-00001: Couldn't find cash register ${id}.`, err)))
}

// Retrieve list of cash register
exports.getCashRegisters = function (req, res, next) {
  console.log('Requesting-getCashRegisters: ' + req.url + ' ...')
  let { pageSize, page, order, ...other } = req.query
  const pagination = { pageSize, page, order }
  srvGetCashRegisters(other, pagination).then((registers) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: pageSize || 10,
      page: page || 1,
      total: registers.rows.length,
      data: JSON.parse(JSON.stringify(registers)),

    })
  }).catch(err => next(new ApiError(404, `ZCRC-00002: Couldn't find cash registers.`, err)))
}

// Create a new cash register
exports.insertCashRegister = function (req, res, next) {
  console.log('Requesting-insertCashRegister: ' + req.url + ' ...')
  const register = req.body
  const userLogIn = extractTokenProfile(req)

  return srvGetPeriodStatus(register.cashierId, register.storeId, register.period, register.shiftId, register.counterId, 0).then(results => {
    if (["7", "99"].indexOf(results.periodstatus.split("|")[0]) > -1) {
      // 7= no open period
      // 99= cash register period is not activate
      return srvCashRegisterExists(register).then(exists => {        
        if (!exists) {
          return srvCashRegisterActive(register).then(dataExists => {
            if (dataExists) {
              next(new ApiError(409, `Cash Register is open in ${dataExists.period} ${dataExists.cashierId} - ${dataExists.shiftName} - ${dataExists.counterName} - ${dataExists.status}.`))
            } else {
              return srvCreateCashRegister(register, userLogIn.userid, next).then((created) => {
                return srvGetCashRegisterById(created.id).then((results) => {
                  const cashRegisterInfo = srvSetCashRegisterInfo(results)
                  let jsonObj = {
                    success: true,
                    message: `Cash Register ${cashRegisterInfo.cashierId} - ${cashRegisterInfo.period} - ${cashRegisterInfo.shiftName} - ${cashRegisterInfo.counterName} - ${cashRegisterInfo.status} created`,
                  }
                  // if (project.message_detail === 'ON')
                  { Object.assign(jsonObj, { cashregisters: results }) }
                  res.xstatus(200).json(jsonObj)
                }).catch(err => next(new ApiError(422, `ZCRC-00009: Couldn't find cash register ${register.cashierId} - ${register.period} - ${register.shiftId} - ${register.counterId}.`, err)))
              }).catch(err => next(new ApiError(422,
                `ZCRC-00008: Couldn't open cash register: ${register.cashierId} - ${register.period} - ${register.shiftId} - ${register.counterId}.`, err)))
            }
          }).catch(err => next(new ApiError(
            422,
            `ZCRC-00009: Couldn't get active cash register: ${register.cashierId} - ${register.period} - ${register.shiftId} - ${register.counterId}.`, err
          ))
          )
        } else {
          // Reopen cash register
          // already have one open period but cash register period is not activate yet
          let statusCode = 422
          let statusMessage = `ZCRC-00007: Couldn't find cash register ${register.cashierId} - ${register.period} - ${register.shiftId} - ${register.counterId}.`
          return srvGetCashRegisterByCols(register).then((results) => {
            const cashRegisterInfo = srvSetCashRegisterInfo(results)
            if(moment(cashRegisterInfo.period).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
              statusCode = 409
              statusMessage = 'Cashier period and current period is not balance\n close cash first, to make transaction ...'
              throw new Error('Out of period.')
            }
            return updateCashRegisterStatus(results.id, 'OO', register, userLogIn, req, res, next)
              .then(() => {
                let jsonObj = {
                  success: true,
                  message: `Cash Register ${cashRegisterInfo.cashierId} - ${cashRegisterInfo.period} - ${cashRegisterInfo.shiftName} - ${cashRegisterInfo.counterName} - ${cashRegisterInfo.status} joined`,
                }
                { Object.assign(jsonObj, { cashregisters: results }) }
                res.xstatus(200).json(jsonObj)
              }).catch(err => next(new ApiError(422, `ZCRC-00026: Couldn't update Cash Register ${register.cashierId} - ${register.period} - ${register.shiftId} - ${register.counterId}.`, err)))
          }).catch(err => next(new ApiError(statusCode, statusMessage, err)))
        }
      }).catch(err => next(new ApiError(422, `ZCRC-00006: Couldn't find Cash Register ${register.cashierId} - ${register.period} - ${register.shiftId} - ${register.counterId}.`, err)))
    } else if (results.periodStatus.substr(0, 1) === "1") {
      // already have one open period
      return srvGetCashRegisterById(results.periodStatus.split("|")[2]).then((results) => {
        const cashRegisterInfo = srvSetCashRegisterInfo(results)
        let jsonObj = {
          success: true,
          message: `Cash Register ${cashRegisterInfo.cashierId} - ${cashRegisterInfo.period} - ${cashRegisterInfo.shiftName} - ${cashRegisterInfo.counterName} - ${cashRegisterInfo.status} joined`,
        }
        // if (project.message_detail === 'ON')
        { Object.assign(jsonObj, { cashregisters: results }) }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(422, `ZCRC-00005: Couldn't find cash register ${register.cashierId} - ${register.period} - ${register.shiftId} - ${register.counterId}.`, err)))
    } else {
      next(new ApiError(409, `ZCRC-00004: ${results.periodStatus}`))
    }
  }).catch(err => next(new ApiError(422,
    `ZCRC-00003: Couldn't check period status for: ${register.cashierId} - ${register.period} - ${register.shiftId} - ${register.counterId}.`, err)))
}

//update Cash Register normal
function updateCashRegisterNormal (id, register, userLogIn, req, res, next) {
  console.log('Requesting-updateCashRegisterNormal: ' + req.url + ' ...')
  srvCashRegisterIdExists(id).then(exists => {
    if (exists) {
      return srvUpdateCashRegister(id, register, userLogIn.userid, null, next).then((updated) => {
        return srvGetCashRegisterById(id).then((results) => {
          const cashRegisterInfo = srvSetCashRegisterInfo(results)
          let jsonObj = {
            success: true,
            message: `Cash Register ${cashRegisterInfo.cashierId} - ${cashRegisterInfo.period} - ${cashRegisterInfo.shiftName} - ${cashRegisterInfo.counterName} - ${cashRegisterInfo.status} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { cashregisters: cashRegisterInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCRC-00013: Couldn't update Cash Register ${id}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCRC-00012: Couldn't update Cash Register ${id}.`, err)))
    } else {
      next(new ApiError(404, `ZCRC-00011: Couldn't find Cash Register ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `ZCRC-00010: Couldn't find Cash Register ${id}.`, err)))
}

//update Cash Register status
function updateCashRegisterStatus (id, status, register, userLogIn, req, res, next) {
  console.log('Requesting-updateCashRegisterStatus: ' + req.url + ' ...')
  let paramStatus = {}, textStatus = ''
  if (status === 'C') {
    paramStatus.current = 'O'
    paramStatus.next = 'C'
    paramStatus.text = 'closed'
  } else if (status === 'R') {
    paramStatus.current = 'C'
    paramStatus.next = 'R'
    paramStatus.text = 'requested'
  } else if (status === 'A') {
    paramStatus.current = 'R'
    paramStatus.next = 'O'
    paramStatus.text = 'request-approved'
  } else if (status === 'X') {
    paramStatus.current = 'R'
    paramStatus.next = 'C'
    paramStatus.text = 'request-rejected'
  } else if (status === 'V') {
    paramStatus.current = 'A'
    paramStatus.next = 'V'
    paramStatus.text = 'verified'
  } else if (status === 'OO') {
    // only when period not activate
    paramStatus.current = 'C'
    paramStatus.next = 'O'
    paramStatus.text = 'period-not-active'
  }
  return srvCashRegisterIdStatusExists(id, paramStatus.current).then(exists => {
    if (exists) {
      if (status === 'OO') {
        return next(new ApiError(409, 'This period has been closed'))
      } else {
        // return srvCreateCashRegisterLog(id, req.body, paramStatus, userLogIn.userid, next).then((created) => {
        //   if (!isEmpty(created)) {
            return srvUpdateCashRegisterStatus(id, paramStatus, register, userLogIn.userid, next).then((updated) => {
              console.log('DXXX01')
              return srvCloseOtherCashRegister(id, paramStatus, register, userLogIn.userid, next).then(closeData => {
                console.log('DXXX02')
                return srvGetCashRegisterById(id).then((results) => {
                  console.log('DXXX03')
                  const cashRegisterInfo = srvSetCashRegisterInfo(results)
                  // cashRegisterInfo.transNo = created.transNo
                  // cashRegisterInfo.transDate = created.transDate
                  // cashRegisterInfo.problemDesc = created.problemDesc
                  // cashRegisterInfo.actionDesc = created.actionDesc
                  console.log('DXXX04')
                  let jsonObj = {
                    success: true,
                    message: `Cash Register ${cashRegisterInfo.cashierId} - ${cashRegisterInfo.period} - ${cashRegisterInfo.shiftName} - ${cashRegisterInfo.counterName} - ${cashRegisterInfo.status} ${paramStatus.text}`,
                    cashregisters: cashRegisterInfo
                  }
                  console.log('DXXX05')
                  res.xstatus(200).json(jsonObj)
                }).catch(err => next(new ApiError(422, `ZCRC-00018: Couldn't update Cash Register ${id}.`, err)))
              }).catch(err => next(new ApiError(422, `ZCRC-00022: Couldn't close other Cash Register ${id}.`, err)))
            }).catch(err => next(new ApiError(422, `ZCRC-00017: Couldn't update Cash Register ${id}.`, err)))
        //   }
        // }).catch(err => next(new ApiError(422, `ZCRC-00023: Couldn't update Cash Register ${id}.`, err)))
      }
    }
  }).catch(err => next(new ApiError(422, `ZCRC-00014: Couldn't find Cash Register for ${id}.`, err)))
}

//Update a cash register
exports.updateCashRegister = function (req, res, next) {
  console.log('Requesting-updateCashRegister: ' + req.url + ' ...')
  const id = req.params.id
  let register = req.body
  const userLogIn = extractTokenProfile(req)
  if (isEmpty(req.query)) {
    return updateCashRegisterNormal(
      id, register, userLogIn, req, res, next
    ).catch(err => next(new ApiError(422, `ZCRC-00024: Couldn't find Cash Register for ${id}.`, err)))
  } else {
    if (req.query.hasOwnProperty('status')) {
      return updateCashRegisterStatus(
        id, req.query.status, register, userLogIn, req, res, next
      ).catch(err => next(new ApiError(422, `ZCRC-00025: Couldn't find Cash Register for ${id}.`, err)))
    }
  }
}

// Retrieve a cash register details
exports.getCashRegisterDetails = function (req, res, next) {
  console.log('Requesting-getCashRegisterDetails: ' + req.url + ' ...')
  const id = req.params.id
  srvGetCashRegisterLogById(id).then((register) => {
    register.forEach(element => { if (element) element.previousValue = JSON.parse(element.previousValue) })
    register.forEach(element => { if (element) element.newValue = JSON.parse(element.newValue) })
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: register
    })
  }).catch(err => next(new ApiError(404, `ZCRC-00021: Couldn't find cash register detail for ${id}.`, err)))
}

// Retrieve a cash register details
exports.getCashRegisterDetailsByLog = function (req, res, next) {
  console.log('Requesting-getCashRegisterDetails: ' + req.url + ' ...')
  const { id, logid } = req.params
  srvGetCashRegisterLogByLogId(id, logid).then((register) => {
    register.forEach(element => { if (element) element.previousValue = JSON.parse(element.previousValue) })
    register.forEach(element => { if (element) element.newValue = JSON.parse(element.newValue) })
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: register
    })
  }).catch(err => next(new ApiError(404, `ZCRC-00021: Couldn't find cash register detail for ${id}.`, err)))
}