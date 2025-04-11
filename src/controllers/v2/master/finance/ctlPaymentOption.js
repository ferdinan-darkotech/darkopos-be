import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import {
  srvGetPaymentOptions, srvPaymentOptionExist,
  srvGetPaymentOptionByCode, srvGetPaymentOptionById,
  srvCreatePaymentOption,
  srvDeletePaymentOption, srvUpdatePaymentOption
} from '../../../../services/v2/master/finance/srvPaymentOption'
import { getMiscByCode, getMiscByCodeName, createMisc } from '../../../../services/v1/miscService'
import { srvGetEDCMachines } from '../../../../services/v2/master/finance/srvEDCMachine'
import { extractTokenProfile } from '../../../../services/v1/securityService'

// Get Payment Options
exports.getPaymentOptions = function (req, res, next) {
  console.log('Requesting-getPaymentOptions: ' + JSON.stringify(req.query) + ' ...')
  let { pageSize, page, ...other } = req.query
  let pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  }
  let mode = []
  let prmsMisc, prmsPaymentOption, prmsEDC
  if (other && other.hasOwnProperty('m')) {
    mode = other.m.split(',')
    if (['ar','lov'].some(_ => mode.includes(_))) pagination = {}
  }


  if (mode.includes('ext1')) prmsMisc = getMiscByCode('FINPROVOTHER', {fields:'miscVariable'})
  if (mode.includes('ext2')) prmsEDC = srvGetEDCMachines({m: 'lov'})

  prmsPaymentOption = srvGetPaymentOptions(req.query)

  let prmsAll = Promise.all([prmsPaymentOption, prmsMisc, prmsEDC])

  prmsAll.then((values) => {
    let cardInfo = (values[1]) ? values[1][0].miscVariable : null
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: values[0].count,
      data: values[0].rows,
      cardInfo,
      edc: values[2]
    })
  }).catch(err => {
    console.log(err)
    next(new ApiError(422,`ZCPO-00001: Couldn't find Options`, err))
  })
}

// Get A Payment Option By Code
exports.getPaymentOptionByCode = function (req, res, next) {
  console.log('Requesting-getPaymentOptionByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params

  srvGetPaymentOptionByCode(code).then((option) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: option
    })
  }).catch(err => next(new ApiError(422,`ZCPO-00002: Couldn't find Options`, err)))
}

// Create a new Options
const createNewPaymentOption = function (data,userLogIn,res, next) {
  srvPaymentOptionExist(data.code).then(exists => {
    if (exists)
      next(new ApiError(409, `ZCPO-00003: Payment Option '${data.code}' already exists.`))
    else {
      return srvCreatePaymentOption(data, userLogIn.userid, next).then((created) => {
        return srvGetPaymentOptionById(created.id).then((result) => {
          let jsonObj = {
            success: true,
            message: `Payment Option ${result.code} created`,
          }
          // if (project.message_detail === 'ON')
          { Object.assign(jsonObj, { paymentopt: result }) }
          res.xstatus(200).json(jsonObj)
          next(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCPO-00004: Couldn't find Payment Option ${data.code}.`, err)))
      }).catch(err => next(new ApiError(501, `ZCPO-00005: Couldn't create Payment Option ${data.code}.`, err)))
    }
  })
}

exports.insertPaymentOption = function (req, res, next) {
  console.log('Requesting-insertPaymentOption: ' + req.url + ' ...')
  let { type, ...data } = req.body
  const userLogIn = extractTokenProfile(req)

  if(data.parentCode === null) {
    getMiscByCodeName('FINPAYMENT',data.code).then(exist => {
      const misc = { miscDesc: data.paymentOptionName, miscVariable: null}
      if(exist) {
        next(new ApiError(409, `ZCPO-00014: Payment Option '${data.code}' already exists.`))
      } else {
        createMisc('FINPAYMENT',data.code,misc,userLogIn.userid,next).then(result => {
          // create misc success
          data.paymentType = result.miscName
          createNewPaymentOption(data,userLogIn,res, next)
        }).catch(err => {
          next(new ApiError(422, `ZCPO-00006: Couldn't update Payment Option ${data.code}.`, err))
        })
      }
    })
  } else { createNewPaymentOption(data,userLogIn,res, next) }
  
}

//Update Payment
exports.updatePaymentOption = function (req, res, next) {
  console.log('Requesting-updatePaymentOptions: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvPaymentOptionExist(data.code).then(exists => {
    if (exists) {
      return srvUpdatePaymentOption(data, userLogIn.userid, next).then((updated) => {
        return srvGetPaymentOptionByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Payment Option ${result.code} updated`,
          }
          { Object.assign(jsonObj, { paymentopt: result }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCPO-00006: Couldn't update Payment Option ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCPO-00007: Couldn't update Payment Option ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCPO-00008: Couldn't find Payment Option ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCPO-00009: Couldn't find Payment Option ${data.code} .`, err)))
}

//Delete a PaymentOption
exports.deletePaymentOption = function (req, res, next) {
  console.log('Requesting-deletePaymentOption: ' + req.url + ' ...')
  let code = req.params.code
  srvPaymentOptionExist(code).then(exists => {
    if (exists) {
      srvDeletePaymentOption(code).then((optionDeleted) => {
        if (optionDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Payment Option ${code} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { payment: optionDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCPO-00010: Payment Option ${code} fail to delete.`))
        }
      }).catch(err => next(new ApiError(500, `ZCPO-00011: Couldn't delete Payment Option ${code}.`, err)))
    } else {
      next(new ApiError(422, `ZCPO-00012: Payment Option ${code} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCPO-00013: Payment Option ${code} not exists.`, err)))
}
