import {
  srvCreateDataDivision, srvGetDataDivision, srvUpdateDataDivision, srvGetDataDivisionByCode
} from '../../../../services/v2/master/other/srvDivision'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../../services/v1/securityService'

export function ctlGetDataDivision (req, res, next) {
  return srvGetDataDivision(req.query).then(div => {
    res.xstatus(200).json({
      success: true,
      data: div.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: div.count
    })
  }).catch(err => next(new ApiError(422, `ZSDIV-00001: Couldn't find division`, err)))
}

export function ctlCreateDataDivision (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return srvGetDataDivisionByCode(req.params.code).then(exists => {
    if(exists) throw new Error('Division has been exists')
    return srvCreateDataDivision({...req.body, user: userLogin.userid}).then(created => {
      res.xstatus(200).json({
        success: true,
        message: `Data division ${req.body.divname} (${req.body.divcode}) has been created`
      })
    }).catch(err => next(new ApiError(422, `ZSDIV-00003: Couldn't create div`, err)))
  }).catch(err => next(new ApiError(422, `ZSDIV-00002: Couldn't create div`, err)))
}

export function ctlUpdateDataDivision (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return srvGetDataDivisionByCode(req.params.code).then(exists => {
    if(!exists) throw new Error('Division is not exists')
    return srvUpdateDataDivision({...req.body, user: userLogin.userid}, req.params.code).then(updated => {
      res.xstatus(200).json({
        success: true,
        message: `Data division ${req.body.divname} (${req.params.code}) has been updated`
      })
    }).catch(err => next(new ApiError(422, `ZSDIV-00005: Couldn't update div`, err)))
  }).catch(err => next(new ApiError(422, `ZSDIV-00004: Couldn't update div`, err)))
}