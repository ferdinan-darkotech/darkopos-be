import express from 'express'
import {ApiError} from '../services/v1/errorHandlingService'
import {
  setCashierTransInfo,
  getCashierTransData,
  getCashierTransById,
  createCashierTrans,
  updateCashierTrans
} from '../services/cashierTransService'

const router = express.Router()

// Daftar Cashier Trans By Id
exports.getCashierTransById = function (req, res, next) {
  console.log('Requesting-getCashierTransById: ' + req.url + ' ...')
  const cashierId = (req.params.cashierId != 'null' ? req.params.cashierId : '%')
  const cashierNo = (req.params.cashierNo != 'null' ? req.params.cashierNo : '%')
  const shift = (req.params.shift != 'null' ? req.params.shift : '%')
  const status = (req.params.status != 'null' ? req.params.status : '%')
  const storeId = req.params.storeId
  console.log('cashierId', cashierId)
  console.log('cashierNo', cashierNo)
  console.log('shift', shift)
  console.log('status', status)

  //periode
  var today = new Date()
  var dd = today.getDate()
  var mm = today.getMonth() + 1 //January is 0!
  var yyyy = today.getFullYear()

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  today = yyyy + '-' + mm + '-' + dd
  //-------------------

  const transDate = today

  getCashierTransById(cashierId, cashierNo, shift, storeId, transDate, status).then((cashierTrans) => {
    console.log('transDate', transDate)
    console.log('cashierTrans', cashierTrans)
    const cashierTransToReturn = setCashierTransInfo(cashierTrans)

    res.xstatus(200).json({
      data: cashierTransToReturn
    })
  }).catch(
    err => res.xstatus(501).json({
      data: {}
    })
  )
}

// Daftar Cashier Trans
exports.getCashierTransData = function (req, res, next) {
  console.log('Requesting /api/cashierTrans/list ...')

  getCashierTransData().then((cashierTrans) => {
    const cashierTransToReturn = JSON.parse(JSON.stringify(cashierTrans))

    res.xstatus(200).json({
      data: cashierTransToReturn
    })

  }).catch(err => next(new ApiError(501, `Couldn't find Data Cashier Trans.`, err)))
}

// Create a new Cashier Trans
exports.createCashierTrans = function (req, res, next) {
  console.log('Requesting /api/cashierTrans ...', req.body)
  let dataCashierTrans = req.body

  //detail
  createCashierTrans(JSON.stringify(dataCashierTrans, null, 4)).then((dataCashierTrans) => {
    res.xstatus(200).json({
      data: 'Insert Successfull...!',
      success: true
    })
  }).catch(err => next(new ApiError(500, `Couldn't save Transaction.`, err)))
}

// Update Cashier Trans
exports.updateCashierTrans = function (req, res, next) {
  console.log('Requesting /api/cashierTrans/update ...')
  let dataCashierTrans = req.body;

  updateCashierTrans(JSON.stringify(dataCashierTrans, null, 4)).then((cashierTrans) => {
    res.xstatus(200).json({
      data: 'Update Successfull...!',
      success: true
    })
  }).catch(err => next(new ApiError(500, `Couldn't save Transaction.`, err)))
}

export default router