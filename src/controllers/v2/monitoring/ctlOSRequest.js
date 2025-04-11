import { srvGetDetailOsRequest, srvGetHeaderOsRequest, srvGetSomeDetailOsRequest } from '../../../services/v2/monitoring/srvOSRequest'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'

export function ctlGetHeaderOsRequest (req, res, next) {
  console.log('Requesting-ctlGetHeaderOsRequest: ' + JSON.stringify(req.params) + ' ...')
  const query = {
    storeid: req.params.store,
    ...req.query
  }
  return srvGetHeaderOsRequest(query).then(header => {
    res.xstatus(200).json({
      success: true,
      data: header.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: header.count,
    })
  })
}

export function ctlGetDetailOsRequest (req, res, next) {
  console.log('Requesting-ctlGetDetailOsRequest: ' + JSON.stringify(req.params) + ' ...')
  const query = {
    ...req.query,
    storeid: req.params.store
  }

  if(req.params.trans === 'blank') {
    return srvGetDetailOsRequest(query).then(detail => {
      res.xstatus(200).json({
        success: true,
        data: detail.rows,
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 10,
        total: detail.count,
      })
    })
  } else {
    return srvGetSomeDetailOsRequest({ ...req.params }).then(detail => {
      res.xstatus(200).json({
        success: true,
        data: detail,
        total: detail.length,
      })
    })
  }
}
