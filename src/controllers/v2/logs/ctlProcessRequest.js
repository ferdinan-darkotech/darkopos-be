import {
  srvGetAllActiveProcessLogs, srvGetSomeRequestReportLogs
} from '../../../services/v2/logs/srvProcessRequest'
import { ApiError } from '../../../services/v1/errorHandlingService'

export function ctlGetAllActiveProcessLogs (req, res, next) {
  console.log('Requesting-ctlGetSomeRequestReportLogs: ' + JSON.stringify(req.query) + '...' + JSON.stringify(req.url))
  return srvGetAllActiveProcessLogs(req.query).then(_logs => {
    res.xstatus(200).json({
      success: true,
      data: _logs.data,
      total: _logs.data.length
    })
  }).catch(er => next(new ApiError(400, er.message)))
}

export function ctlGetSomeRequestReportLogs (req, res, next) {
  console.log('Requesting-ctlGetSomeRequestReportLogs: ' + JSON.stringify(req.query) + '...' + JSON.stringify(req.url))
  let servicesLogs = null

  switch (req.params.type) {
    case 'REPORT':
      servicesLogs = srvGetSomeRequestReportLogs
      break
    default:
      break
  }


  if(!servicesLogs || typeof servicesLogs !== 'function') {
    return next(new ApiError(404, 'Type logs is not defined.'))
  } else {
    return servicesLogs(req.query).then(_logs => {
      res.xstatus(200).json({
        success: true,
        data: _logs.data,
        total: _logs.count,
        pageSize: +(req.query.pageSize || 100),
        page: +(req.query.page || 1)
      })
    }).catch(er => next(new ApiError(400, er.message)))
  }
}