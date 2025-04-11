import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getDataId, getData, getDataCode, countData, insertData, updateData, deleteData,
  dataExists, cancelData
} from '../../services/loyalty/loyaltyService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Retrieve list a row
exports.getDataId = function (req, res, next) {
  console.log('Requesting-getDataId-Loyalty: ' + req.url + ' ...')
  const id = req.params.id
  getDataId(id).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: data
    })
  }).catch(err => next(new ApiError(422, `Couldn't find data ${id}.`, err)))
}

// Retrieve list a row
exports.getDataIdActive = function (req, res, next) {
  console.log('Requesting-getDataIdActive-Loyalty: ' + req.url + ' ...')
  const id = req.params.id
  getDataCode(id).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: data
    })
  }).catch(err => next(new ApiError(422, `Couldn't find data ${id}.`, err)))
}

// Retrieve list of stocks
exports.getData = function (req, res, next) {
  console.log('Requesting-getStocks-Loyalty: ' + req.url + ' ...')
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
  console.log('Requesting-insertData-Loyalty: ' + req.url + ' ...')
  const data = req.body
  const userLogIn = extractTokenProfile(req)
  getDataCode(data).then(exists => {
    if (!exists) {
      return insertData(data, userLogIn.userid, next).then((created) => {
        let jsonObj = {
          success: true,
          message: `Data created`,
          data: created
        }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
    } else {
      let jsonObj = {
        success: false,
        message: 'Data Already Exists',
        data: exists
      }
      res.xstatus(409).json(jsonObj)
    }
  }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
}

//Update a Data
exports.updateData = function (req, res, next) {
  console.log('Requesting-updateData-Loyalty: ' + req.url + ' ...')
  const id = req.params.id
  console.log('id', id)
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  dataExists(id).then(existsId => {
    if (existsId) {
      return getDataCode(data).then(exists => {
        if (!exists) {
          return updateData(id, data, userLogIn.userid).then((updated) => {
            if (updated) {
              let jsonObj = {
                success: true,
                message: `Data updated`,
              }
              res.xstatus(200).json(jsonObj)
            }
          }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
        } else if (exists && exists.id === data.id) {
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
          let jsonObj = {
            success: false,
            message: 'Data Already Exists',
            data: exists
          }
          res.xstatus(409).json(jsonObj)
        }
      }).catch(err => next(new ApiError(501, `Couldn't create Loyalty.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

exports.cancelData = function (req, res, next) {
  console.log('Requesting-cancelData-Loyalty: ' + req.url + ' ...')
  const id = req.params.id
  dataExists(id).then(exists => {
    if (exists) {
      const userLogIn = extractTokenProfile(req)
      return cancelData(id, userLogIn.userid).then((deleted) => {
        if (deleted) {
          let jsonObj = {
            success: true,
            message: `Data ${id} canceled`,
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


// Delete a Record
exports.deleteData = function (req, res, next) {
  console.log('Requesting-deleteData-Loyalty: ' + req.url + ' ...')
  const id = req.params.id
  dataExists(id).then(exists => {
    if (exists) {
      const userLogIn = extractTokenProfile(req)
      return deleteData(id, userLogIn.userid).then((deleted) => {
        if (deleted) {
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
