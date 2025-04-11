import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  srvGetCustomReportOptions, srvGetCustomReportForm
} from '../../../services/v2/report/srvCustomReport'
import { extractTokenProfile } from '../../../services/v1/securityService'

export function ctlGetCustomReportOptions (req, res, next) {
  console.log('Requesting-ctlGetCustomReportOptions: ' + JSON.stringify(req.params) + ' ...')

  return srvGetCustomReportOptions().then((rs) => {
    res.xstatus(200).json({
      success: true,
      data: (rs || []),
      total: (rs || []).length
    })
  })
}

export function ctlGetCustomReportForm (req, res, next) {
  console.log('Requesting-ctlGetCustomReportForm: ' + JSON.stringify(req.params) + ' ...')

  return srvGetCustomReportForm(req.params.form_code).then((rs) => {
    res.xstatus(200).json({
      success: true,
      data: (rs || {})
    })
  })
}