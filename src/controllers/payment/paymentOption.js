import project from '../../../config/project.config'
import {
  ApiError
} from '../../services/v1/errorHandlingService'
import {
  getPaymentOption,
  createPaymentOption,
  paymentExists,
  updatePaymentOption,
  deletePaymentOption
} from '../../services/payment/paymentOptionService'
import {
  extractTokenProfile
} from '../../services/v1/securityService'

// Get Payment Options
exports.getPaymentOption = function (req, res, next) {
  console.log('Requesting-getPaymentOption: ' + JSON.stringify(req.params) + ' ...')
  getPaymentOption(req.query).then((Payment) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: Payment
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Options`, err)))
}

// Create a new Options
exports.insertPaymentOption = function (req, res, next) {
  console.log('Requesting-insertPaymentOption: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  paymentExists(data.typeCode).then(exists => {
    if (exists)
      next(new ApiError(409, `option '${data.typeCode}' already exists.`))
    else {
      return createPaymentOption(data, userLogIn.userid, next).then(() => {
        let jsonObj = {
          success: true,
          message: `Payment ${data.typeCode} created`,
        }
        if (project.message_detail === 'ON') { Object.assign(jsonObj, { data: req.body }) }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(501, `Couldn't create payment ${data.typeCode}.`, err)))
    }
  })
}

//Update Payment
exports.updatePaymentOption = function (req, res, next) {
  console.log('Requesting-updatePaymentOption: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  paymentExists(data.typeCode).then(exists => {
    if (exists) {
      return updatePaymentOption(id, data, userLogIn.userid, next).then(() => {
        let jsonObj = {
          success: true,
          message: `Payment ${data.typeCode} updated`,
        }
        if (project.message_detail === 'ON') { Object.assign(jsonObj, { data: data }) }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(422, `Couldn't update payment id: ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find payment id: ${id} .`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find payment ${data.typeCode} .`, err)))
}

//Delete a PaymentOption
exports.deletePaymentOption = function (req, res, next) {
  console.log('Requesting-deletePaymentOption: ' + req.url + ' ...')
  let code = req.query.typeCode
  paymentExists(code).then(exists => {
    if (exists) {
      deletePaymentOption(code).then((paymentDeleted) => {
        if (paymentDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Payment ${code} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { payment: paymentDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Payment ${code} fail to delete.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Payment ${code}.`, err)))
    } else {
      next(new ApiError(422, `Payment ${code} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Payment ${code} not exists.`, err)))
}
