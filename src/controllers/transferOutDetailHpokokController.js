import { ApiError } from '../services/v1/errorHandlingService'
import {
  getData, countData
} from '../services/transferOutDetailHpokokService'
import sequelize from '../native/sequelize'

// Retrieve list of data
exports.getData = function (req, res, next) {
  console.log('Requesting-transferOutHpokok: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
  countData(other).then((count) => {
    return getData(other, pagination).then((data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: data['count'],
        data: data['rows']
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

// Retrieve list of data change
exports.getDataChangeTransferOut = function (req, res, next) {
  console.log('Requesting-transferOutHpokok: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  return sequelize.query('select * from sp_show_transfer_out (:reference);',
    { replacements: { reference: other.transNoId || null } }).then((dataTransfer) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        data: dataTransfer,
        total: (dataTransfer || []).length
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
}

// Retrieve list of data change
exports.getDataChangeTransferIn = function (req, res, next) {
  console.log('Requesting-transferOutHpokok: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  return sequelize.query('select * from sp_show_transfer_in (:reference);',
    { replacements: { reference: other.transNoId || null } }).then((dataTransfer) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        data: dataTransfer,
        total: (dataTransfer || []).length
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
}