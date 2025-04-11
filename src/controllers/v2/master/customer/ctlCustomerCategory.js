import {
  srvGetMemberCategory, srvCreatedMemberCategory, srvUpdatedMemberCategory
} from '../../../../services/v2/master/customer/srvCustomerCategory'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../../services/v1/securityService'

export function ctlGetMemberCategory (req, res, next) {
  return srvGetMemberCategory(req.query).then(cust => {
    res.xstatus(200).json({
      success: true,
      data: cust.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 20,
      total: cust.count
    })
  }).catch(err => next(new ApiError(422, `ZCSC-00001: Couldn't find group customer`, err)))
}

export function ctlCreatedMemberCategory (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return srvCreatedMemberCategory(req.body, userLogin.userid).then(crt => {
    res.xstatus(200).json({
      success: true,
      message: `Data has been created`
    })
  }).catch(err => next(new ApiError(422, `ZCSC-00002: Couldn't modify group customer`, err)))
}

export function ctlUpdatedMemberCategory (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return srvUpdatedMemberCategory(req.body, userLogin.userid).then(upd => {
    res.xstatus(200).json({
      success: true,
      message: `Data has been updated`
    })
  }).catch(err => next(new ApiError(422, `ZCSC-00003: Couldn't modify group customer`, err)))
}