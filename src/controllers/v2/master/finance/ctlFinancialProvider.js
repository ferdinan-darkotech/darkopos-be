import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import {
  srvGetFinancialProviders, srvFinancialProviderExist,
  srvGetFinancialProviderById, srvGetFinancialProviderByCode,
  srvCreateFinancialProvider, srvDeleteFinancialProvider, srvUpdateFinancialProvider
} from '../../../../services/v2/master/finance/srvFinancialProvider'
import { getEveryMiscByCode } from '../../../../services/v1/miscService'
import { extractTokenProfile } from '../../../../services/v1/securityService'

// Get Financial Providers
exports.getFinancialProviders = function (req, res, next) {
  console.log('Requesting-getFinancialProviders: ' + req.url + ' ...')
  let prmsFinancial, prmsEveryMisc
  let { pageSize, page, ...other } = req.query
  let pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  }
  if (other && other.hasOwnProperty('m')) {
    const mode = other.m.split(',')
    if (['ar','lov'].some(_ => mode.includes(_))) pagination = {}
  }

  prmsEveryMisc = req.query.m.includes('ext1') ? getEveryMiscByCode('FINPAYMENT') : undefined
  prmsFinancial = srvGetFinancialProviders(req.query)
  
  let prmsAll = Promise.all([prmsFinancial, prmsEveryMisc])
  prmsAll.then((values) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: values[0].count,
      data: values[0].rows,
      paymentInfo: values[1]
    })
  }).catch(err => next(new ApiError(422, `ZCFP-00001: Couldn't find Financial Providers`, err)))
}

// Create a new provider
exports.insertFinancialProvider = function (req, res, next) {
  console.log('Requesting-insertFinancialProvider: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  srvFinancialProviderExist(data.code).then(exists => {
    if (exists)
      next(new ApiError(409, `ZCFP-00002-Financial Provider '${data.code}' already exists.`))
    else {
      return srvCreateFinancialProvider(data, userLogIn.userid, next).then((created) => {
        return srvGetFinancialProviderById(created.id).then((result) => {
          let jsonObj = {
            success: true,
            message: `Financial Provider ${result.code} created`,
          }
          // if (project.message_detail === 'ON')
          { Object.assign(jsonObj, { provider: result }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCFP-00003: Couldn't find Financial Provider ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCFP-00004: Couldn't create Financial Provider ${data.code}.`, err)))
    }
  })
}

//Update a Financial Provider
exports.updateFinancialProvider = function (req, res, next) {
  console.log('Requesting-updateFinancialProvider: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvFinancialProviderExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateFinancialProvider(data, userLogIn.userid, next).then((updated) => {
        return srvGetFinancialProviderByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Financial Provider ${result.code} updated`,
          }
          { Object.assign(jsonObj, { provider: result }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCFP-00005: Couldn't update Financial Provider ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCFP-00006: Couldn't update Financial Provider ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCFP-00007: Couldn't find Financial Provider ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCFP-00008: Couldn't find Financial Provider ${data.code} .`, err)))
}

//Delete a Financial Providers
exports.deleteFinancialProvider = function (req, res, next) {
  console.log('Requesting-deleteFinancialProvider: ' + req.url + ' ...')
  let code = req.params.code
  srvFinancialProviderExist(code).then(exists => {
    if (exists) {
      srvDeleteFinancialProvider(code).then((optionDeleted) => {
        if (optionDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Financial Provider ${code} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { payment: optionDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCFP-00009: Couldn't delete Financial Provider ${code}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCFP-00010: Couldn't delete Financial Provider ${code}.`, err)))
    } else {
      next(new ApiError(422, `ZCFP-00011: Financial Provider ${code} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCFP-00012: Financial Provider ${code} not exists.`, err)))
}
