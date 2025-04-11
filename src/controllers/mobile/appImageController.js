import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getDataId, getData, countData, insertData, updateData, deleteData,
  dataExists, dataExistsCode
} from '../../services/mobile/appImageService'
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

  let prmsWall, prmsSlide, prmsAll
  if (other.hasOwnProperty('imageType') && (other.imageType === 'all')) {
    other.imageType = 1
    prmsWall = getData(other, pagination, 'mobile')
    other.imageType = 2
    prmsSlide = getData(other, pagination, 'mobile')
    prmsAll = Promise.all([prmsWall, prmsSlide])
    prmsAll.then((values) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        wall: { data: values[0].rows,
          total: (values[0].count > 5) ? 5 : values[0].count },
        slide: { data: values[1].rows,
          total: (values[1].count > 10) ? 10 : values[1].count }
      })
    })
  } else {
    return getData(other, pagination).then((data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: data.count,
        data: data.rows
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
  }
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
  }).catch(err => next(new ApiError(501, `Couldn't create Data.`, err)))
}

//Update a Data
exports.updateData = function (req, res, next) {
  console.log('Requesting-updateData: ' + req.url + ' ...')
  const id = req.params.id
  console.log('id', id)
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  dataExists(id).then(exists => {
    if (exists) {
      return updateData(id, data, userLogIn.userid).then((updated) => {
        if (updated) {
          let jsonObj = {
            success: true,
            message: `Data updated`,
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
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
