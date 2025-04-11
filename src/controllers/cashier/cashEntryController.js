/**
 * Created by  pa n da .h as .m y .id on 2018-06-08.
 */
import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  srvShiftIdExists,
  srvGetExpenseById,
  countData,
  srvGetExpenses,
  srvCreateExpense,
  srvUpdateExpense,
  srvDeleteExpense
} from '../../services/cashier/cashEntryService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Retrieve list a expense
exports.getCashEntry = function (req, res, next) {
  console.log('Requesting-getCashEntry: ' + req.url + ' ...')
  const id = req.params.id
  srvGetExpenseById(id).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: data
    })
  }).catch(err => next(new ApiError(404, `ZEPC-00001: Couldn't find Expense ${id}.`, err)))
}

// Retrieve list of expense
exports.getCashEntries = function (req, res, next) {
  console.log('Requesting-getCashEntries: ' + req.url + ' ...')
  let { pageSize, page, order, ...other } = req.query
  const pagination = { pageSize, page, order }
  countData(other).then((count) => {
    return srvGetExpenses(other, pagination).then((data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: count,
        data: data,
      })
    }).catch(err => next(new ApiError(404, `ZEPC-00002: Couldn't find Expense.`, err)))
  })
}

// Create a new expense
exports.insertCashEntry = function (req, res, next) {
  console.log('Requesting-insertCashEntry: ' + req.url + ' ...')
  const body = req.body.data
  const detail = req.body.detail
  const userLogIn = extractTokenProfile(req)
  return srvCreateExpense(body, detail, userLogIn.userid, next).then((created) => {
    let jsonObj = {
      success: true,
      message: `Expense created`,
    }
    res.xstatus(200).json(jsonObj)
  }).catch(err => next(new ApiError(422, `ZEPC-00003: Couldn't create expense.`, err)))
}

// Update a expense
exports.updateCashEntry = function (req, res, next) {
  console.log('Requesting-updateCashEntry: ' + req.url + ' ...')
  const id = req.params.id
  let body = req.body
  const userLogIn = extractTokenProfile(req)
  srvShiftIdExists(id).then(exists => {
    if (exists) {
      return srvUpdateExpense(id, body, userLogIn.userid, next).then((updated) => {
        let jsonObj = {
          success: true,
          message: `Expense updated`,
        }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(422, `ZEPC-00007: Couldn't update Expense.`, err)))
    } else {
      next(new ApiError(404, `ZEPC-00008: Couldn't find Expense.`))
    }
  }).catch(err => next(new ApiError(422, `ZEPC-00009: Couldn't find Expense.`, err)))
}

//Delete a expense
exports.deleteCashEntry = function (req, res, next) {
  console.log('Requesting-deleteCashEntry: ' + req.url + ' ...')
  const id = req.params.id
  srvShiftIdExists(id).then(exists => {
    if (exists) {
      return srvDeleteExpense(id, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Expense ${id} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { shifts: deleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZEPC-00010: Couldn't delete Expense ${id}.`))
        }
      }).catch(err => next(new ApiError(422, `ZEPC-00011: Couldn't delete Expense ${id}}.`, err)))
    } else {
      next(new ApiError(422, `ZEPC-00012: Expense ${id} not available.`))
    }
  }).catch(err => next(new ApiError(422, `ZEPC-00013: Expense ${id} not available.`, err)))
}