import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { getChangeSellpriceData, getChangeSellpriceHeader } from '../../services/Report/toolsReportService'
import { extractTokenProfile } from '../../services/v1/securityService'

exports.getSellPriceReport = function (req, res, next) {
  console.log('Requesting-getSellPriceReport: ' + req.url + ' ...')
  const userLogIn = extractTokenProfile(req)
  const query = {
    status: 0,
    ...req.query
  }
  let { pageSize, page, type, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
    if (type === 'detail') {
      return getChangeSellpriceData(other, pagination, userLogIn.userid).then(dataHeader => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          total: (dataHeader || []).length,
          data: dataHeader || []
        })
      }).catch(err => next(new ApiError(422, `RTS-00001: Couldn't find sellprice.`, err)))
    } else {
      return getChangeSellpriceHeader(req.query, userLogIn.userid).then(data => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          total: (data || []).length,
          data: data || []
        })
      }).catch(err => next(new ApiError(422, `RTS-00001: Couldn't find sellprice.`, err)))
    }
}

exports.getChangeSellpriceHistory = function (req, res, next) {
  console.log('Requesting-getChangeSellpriceHistory: ' + req.url + ' ...')
  const userLogIn = extractTokenProfile(req)
  const query = {
    status: 0,
    ...req.query
  }
  getChangeSellpriceHeader(req.query, userLogIn.userid).then(data => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: (data || []).length,
      data: data || []
    })
  }).catch(err => next(new ApiError(422, `RTS-00002: Couldn't find sellprice.`, err)))
}
