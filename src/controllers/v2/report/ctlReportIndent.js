import project from '../../../../config/project.config'
import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  srvDetailReportIndent, srvDetailReportReturIndent, srvRecapReportIndent, srvRecapReportReturIndent  
} from '../../../services/v2/report/srvIndentReport'
import { extractTokenProfile } from '../../../services/v1/securityService'

export function ctlRecapReportIndent (req, res, next) {
  console.log('Requesting-ctlRecapReportIndent: ' + JSON.stringify(req.params) + ' ...')
  return srvRecapReportIndent(req.body).then((rs) => {
    res.xstatus(200).json({
      success: true,
      data: rs || [],
      total: (rs || []).length
    })
  })
}

export function ctlDetailReportIndent (req, res, next) {
  console.log('Requesting-ctlDetailReportIndent: ' + JSON.stringify(req.params) + ' ...')
  return srvDetailReportIndent(req.body).then((rs) => {
    res.xstatus(200).json({
      success: true,
      data: rs || [],
      total: (rs || []).length
    })
  })
}

export function ctlRecapReportReturIndent (req, res, next) {
  console.log('Requesting-ctlRecapReportReturIndent: ' + JSON.stringify(req.params) + ' ...')
  return srvRecapReportReturIndent(req.body).then((rs) => {
    res.xstatus(200).json({
      success: true,
      data: rs || [],
      total: (rs || []).length
    })
  })
}

export function ctlDetailReportReturIndent (req, res, next) {
  console.log('Requesting-ctlDetailReportReturIndent: ' + JSON.stringify(req.params) + ' ...')
  return srvDetailReportReturIndent(req.body).then((rs) => {
    res.xstatus(200).json({
      success: true,
      data: rs || [],
      total: (rs || []).length
    })
  })
}