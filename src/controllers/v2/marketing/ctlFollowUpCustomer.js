import {
  srvReminderCustomerChecks, srvReminderCustomerProducts, srvReminderCustomerMain
} from '../../../services/v2/marketing/srvFollowUpCustomer'
import { ApiError } from '../../../services/v1/errorHandlingService'

export function ctlReminderCustomerMain (req, res, next) {
  return srvReminderCustomerMain(req.query).then(reminder => {
    res.xstatus(200).json({
      success: true,
      data: reminder.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 1000,
      total: reminder.count
    })
  }).catch(err => next(new ApiError(422, `ZSAREA-00001: Couldn't find area`, err)))
}

export function ctlReminderCustomerChecks (req, res, next) {
  console.log('Requesting-ctlReminderCustomerChecks : ' + req.url + ' ...')
  return srvReminderCustomerChecks(req.query).then(checks => {
    res.xstatus(200).json({
      success: true,
      data: checks.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: checks.count
    })
  }).catch(err => next(new ApiError(422, `ZSRCF-00002: Couldn't find reminder`, err)))
}

export function ctlReminderCustomerProducts (req, res, next) {
  console.log('Requesting-ctlReminderCustomerProducts : ' + req.url + ' ...')
  return srvReminderCustomerProducts(req.query).then(products => {
    res.xstatus(200).json({
      success: true,
      data: products.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: products.count
    })
  }).catch(err => next(new ApiError(422, `ZSRCF-00003: Couldn't find reminder`, err)))
}