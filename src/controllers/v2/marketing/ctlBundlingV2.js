import { extractTokenProfile } from '../../../services/v1/securityService'
import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  srvGetAllKeyByCode, srvGetOneUniqByKeyCode, srvGetSomeKeyByCode
} from '../../../services/v2/marketing/srvBundlingV2'



export function ctlGetSomeKeyByCode (req,res, next) {
  console.log('Requesting-ctlGetSomeKeyByCode: ' + JSON.stringify(req.query) + '...' + JSON.stringify(req.url))
  const userLogIn = req.$userAuth

  return srvGetSomeKeyByCode(req.params.code, userLogIn.userid, req.query).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 100,
      total: rs.count
    })
  }).catch(er => next(new ApiError(400, er.message)))
}


export function ctlGetOneUniqByKeyCode (req,res, next) {
  console.log('Requesting-ctlGetOneUniqByKeyCode: ' + JSON.stringify(req.query) + '...' + JSON.stringify(req.url))
  return srvGetOneUniqByKeyCode(req.params.code, req.params.key).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs
    })
  }).catch(er => next(new ApiError(400, er.message)))
}

export function ctlGetAllKeyByCode (req,res, next) {
  console.log('Requesting-ctlGetAllKeyByCode: ' + JSON.stringify(req.query) + '...' + JSON.stringify(req.url))
  const userLogIn = req.$userAuth
  return srvGetAllKeyByCode(req.params.code, userLogIn.userid).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs
    })
  }).catch(er => next(new ApiError(400, er.message)))
}