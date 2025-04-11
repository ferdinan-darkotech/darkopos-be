import {
  srvGetInsentiveRoles, srvModifyInsentiveRoles
} from '../../../../services/v2/master/general/srvInsentiveRoles'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../../services/v1/securityService'

export function ctlGetInsentiveRoles (req, res, next) {
  return srvGetInsentiveRoles(req.query).then(roles => {
    res.xstatus(200).json({
      success: true,
      data: roles.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 20,
      total: roles.count
    })
  }).catch(err => next(new ApiError(422, `ZISRL-00001: Couldn't find roles`, err)))
}

export function ctlModifyInsentiveRoles (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return srvModifyInsentiveRoles(req.body, userLogin.userid).then(modifier => {
    res.xstatus(200).json({
      success: true,
      data: modifier.value,
      message: `Data roles has been modifier`
    })
  }).catch(err => next(new ApiError(422, `ZISRL-00002: Couldn't modify roles`, err)))
}