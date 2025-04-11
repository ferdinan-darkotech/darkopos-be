import project from '../../../../config/project.config'
import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  srvGetGeneralReports, srvGetRootReports
} from '../../../services/v2/report/srvReports'
import mappingReportOpt from '../../../utils/mappingReportOption'

exports.ctlGetGeneralReports = function (req, res, next) {
  console.log('Requesting-ctlGetReportParams: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  try{
    srvGetGeneralReports(req.query).then((rs) => {
      res.send({
        success: true,
        data: rs,
        length: rs.length
      })
    })
  } catch (er) { next(new ApiError(500, 'Server has no response ..')) }
}

exports.ctlGetRootReports = function (req, res, next) {
  console.log('Requesting-ctlGetRootReports: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  try{
    srvGetRootReports(req.params).then((rs) => {
      res.send({
        success: true,
        data: mappingReportOpt(JSON.parse(JSON.stringify(rs)) || []),
        length: JSON.parse(JSON.stringify(rs)).length
      })
    })
  } catch (er) { next(new ApiError(500, 'Server has no response ..')) }
}
