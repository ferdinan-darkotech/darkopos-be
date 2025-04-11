import {
  srvCreateDataArea, srvGetDataArea, srvUpdateDataArea, srvGetDataAreaByCode
} from '../../../services/v2/master/srvArea'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'

export function ctlGetDataArea (req, res, next) {
  return srvGetDataArea(req.query).then(area => {
    res.xstatus(200).json({
      success: true,
      data: area.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: area.count
    })
  }).catch(err => next(new ApiError(422, `ZSAREA-00001: Couldn't find area`, err)))
}

export function ctlCreateDataArea (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return srvGetDataAreaByCode(req.params.code).then(exists => {
    if(exists) throw new Error('Area has been exists')
    return srvCreateDataArea({...req.body, user: userLogin.userid}).then(created => {
      res.xstatus(200).json({
        success: true,
        message: `Data area ${req.body.areaname} (${req.body.areacode}) has been created`
      })
    }).catch(err => next(new ApiError(422, `ZSAREA-00002: Couldn't create area`, err)))
  }).catch(err => next(new ApiError(422, `ZSAREA-00002: Couldn't create area`, err)))
}

export function ctlUpdateDataArea (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return srvGetDataAreaByCode(req.params.code).then(exists => {
    if(!exists) throw new Error('Area is not exists')
    return srvUpdateDataArea({...req.body, user: userLogin.userid}, req.params.code).then(updated => {
      res.xstatus(200).json({
        success: true,
        message: `Data area ${req.body.areaname} (${req.params.code}) has been updated`
      })
    }).catch(err => next(new ApiError(422, `ZSAREA-00002: Couldn't update area`, err)))
  }).catch(err => next(new ApiError(422, `ZSAREA-00002: Couldn't update area`, err)))
}