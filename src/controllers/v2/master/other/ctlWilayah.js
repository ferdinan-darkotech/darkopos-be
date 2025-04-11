import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetWilayah } from '../../../../services/v2/master/other/srvWilayah'

export function ctlGetWilayah (req, res, next) {
  console.log('Requesting-ctlGetWilayah: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  return srvGetWilayah(req.query).then(data => {
    res.xstatus(200).json({
      success: true,
      data: data.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 25,
      total: data.count,
    })
  }).catch(err => next(new ApiError(422, `ZSRO-00006: Couldn't find order`, err)))
}