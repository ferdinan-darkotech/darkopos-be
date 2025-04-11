import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getDataId, getData, countData, updateData, deleteData,
  dataExists
} from '../../services/permission/permissionRoleService'
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

// Retrieve list
exports.getData = function (req, res, next) {
  console.log('Requesting-getPermissionData: ' + req.url + ' ...')
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
  const data = req.body.data
  const userLogIn = extractTokenProfile(req)
  return updateData(data, userLogIn.userid).then((created) => {
    let jsonObj = {
      success: true,
      message: `Data created`,
      data: created
    }
    res.xstatus(200).json(jsonObj)
  }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
}

// Delete a Record
exports.deleteData = function (req, res, next) {
  console.log('Requesting-deleteData: ' + req.url + ' ...')
  const id = req.params.id
  const userLogIn = extractTokenProfile(req)
  dataExists(id).then(exists => {
    if (exists) {
      return deleteData(id, userLogIn.userid, next).then((deleted) => {
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
