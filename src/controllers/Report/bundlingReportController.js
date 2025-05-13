import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getData, getHeaderData, countHeaderData,
} from '../../services/Report/bundlingReportService'
import { Op } from 'sequelize'

// Retrieve list of getDataReportPos
// mengembalikan product detail dari pos Bundling saja (inner join)
exports.getDataReportPos = function (req, res, next) {
  console.log('Requesting-getDataReportPos: ' + req.url + ' ...')
  let { pageSize, page, from, to, transDate, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
  if (from && to) {
    other.transDate = {
      [Op.gte]: from,
      [Op.lte]: to
    }
  }
  other.bundlingId = {
    [Op.ne]: null
  }
  countHeaderData(other).then((count) => {
    return getHeaderData(other, pagination).then((data) => {
      return getData(other, pagination).then((detail) => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          pageSize: pageSize || 10,
          page: page || 1,
          total: count,
          data: data,
          detail: detail
        })
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}
