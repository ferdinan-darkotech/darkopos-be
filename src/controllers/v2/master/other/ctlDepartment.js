import {
  srvCreateDataDepartment, srvGetDataDepartment, srvUpdateDataDepartment, srvGetDataDepartmentByCode
} from '../../../../services/v2/master/other/srvDepartment'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../../services/v1/securityService'

export function ctlGetDataDepartment (req, res, next) {
  return srvGetDataDepartment(req.query).then(dept => {
    res.xstatus(200).json({
      success: true,
      data: dept.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: dept.count
    })
  }).catch(err => next(new ApiError(422, `ZSDEPT-00001: Couldn't find department`, err)))
}

export function ctlCreateDataDepartment (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return srvGetDataDepartmentByCode(req.params.code).then(exists => {
    if(exists) throw new Error('Department has been exists')
    return srvCreateDataDepartment({...req.body, user: userLogin.userid}).then(created => {
      res.xstatus(200).json({
        success: true,
        message: `Data department ${req.body.deptname} (${req.body.deptcode}) has been created`
      })
    }).catch(err => next(new ApiError(422, `ZSDEPT-00003: Couldn't create dept`, err)))
  }).catch(err => next(new ApiError(422, `ZSDEPT-00002: Couldn't create dept`, err)))
}

export function ctlUpdateDataDepartment (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return srvGetDataDepartmentByCode(req.params.code).then(exists => {
    if(!exists) throw new Error('Department is not exists')
    return srvUpdateDataDepartment({...req.body, user: userLogin.userid}, req.params.code).then(updated => {
      res.xstatus(200).json({
        success: true,
        message: `Data department ${req.body.deptname} (${req.params.code}) has been updated`
      })
    }).catch(err => next(new ApiError(422, `ZSDEPT-00005: Couldn't update dept`, err)))
  }).catch(err => next(new ApiError(422, `ZSDEPT-00004: Couldn't update dept`, err)))
}