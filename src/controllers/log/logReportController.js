import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getDataId, getData, countData, insertData, updateData, deleteData,
  dataExists, dataExistsCode, deleteSomeData
} from '../../services/log/logReportService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Retrieve list a row
exports.getDataId = function (req, res, next) {
  console.log('Requesting-getDataId: ' + req.url + ' ...')
  const id = req.params.id
  getDataId(id).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: data
    })
  }).catch(err => next(new ApiError(422, `Couldn't find data ${id}.`, err)))
}

// Retrieve list of stocks
exports.getData = function (req, res, next) {
  console.log('Requesting-getStocks: ' + req.url + ' ...')
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
        total: count,
        data: data
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

// Create a new data
exports.insertData = function (req, res, next) {
  console.log('Requesting-insertData: ' + req.url + ' ...')
  const data = req.body
  const userLogIn = extractTokenProfile(req)
  return insertData(data, userLogIn.userid, next).then((created) => {
    let jsonObj = {
      success: true,
      message: `Data created`,
    }
    if (project.message_detail === 'ON') { Object.assign(jsonObj, { data: created }) }
    res.xstatus(200).json(jsonObj)
  }).catch(err => next(new ApiError(501, `Couldn't create log.`, err)))
}

//Update a Data
exports.updateData = function (req, res, next) {
  console.log('Requesting-updateData: ' + req.url + ' ...')
  const id = req.params.id
  console.log('id', id)
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  return updateData(id, data, userLogIn.userid).then((updated) => {
    if (updated) {
      let jsonObj = {
        success: true,
        message: `Data updated`,
      }
      res.xstatus(200).json(jsonObj)
    }
  }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
}

// Delete a Record
exports.deleteData = function (req, res, next) {
  console.log('Requesting-deleteData: ' + req.url + ' ...')
  const id = req.params.id
  dataExists(id).then(exists => {
    if (exists) {
      return deleteData(id, next).then((stockDeleted) => {
        if (stockDeleted) {
          let jsonObj = {
            success: true,
            message: `Data ${id} deleted`,
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Couldn't delete Data ${id}.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Data ${id}.`, err)))
    } else {
      next(new ApiError(404, `Data ${id} not exists.`))
    }
  }).catch(err => next(new ApiError(404, `Data ${id} not exists.`, err)))
}

// Delete Some Record
exports.deleteSomeData = function (req, res, next) {
  console.log('Requesting-deleteSomeData: ' + req.url + ' ...')
  const from = req.body.from
  const to = req.body.to
  return deleteSomeData(from, to, next).then((stockDeleted) => {
    let jsonObj = {
      success: true,
      message: `Data ${from} to ${to} deleted`,
    }
    res.xstatus(200).json(jsonObj)
  }).catch(err => next(new ApiError(500, `Couldn't delete Data ${from} to ${to}.`, err)))
}