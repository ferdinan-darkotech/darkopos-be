import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getDataId, getData, countData, insertData, updateData, deleteData,
  dataExists, dataExistsCode, dataExistsVariantCode
} from '../../services/product/stockVariantService'
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
  console.log('Requesting-getDataVariant: ' + req.url + ' ...')
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
  console.log('Requesting-insertDataVariantstock: ' + req.url + ' ...')
  const data = req.body
  const userLogIn = extractTokenProfile(req)
  dataExistsVariantCode(data).then(existsVariant => {
    if (!existsVariant) {
      return dataExistsCode(data).then(exists => {
        if (!exists) {
          return insertData(data, userLogIn.userid, next).then((created) => {
            let jsonObj = {
              success: true,
              message: `Data created`,
            }
            if (project.message_detail === 'ON') { Object.assign(jsonObj, { data: created }) }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(422, `Couldn't create variant.`, err)))
        } else {
          next(new ApiError(422, `Record ${data.productId} and ${data.variantId} already exists.`))
        }
      }).catch(err => next(new ApiError(422, `Couldn't create variant.`, err)))
    } else {
      if (data.variantName) {
        next(new ApiError(422, `Variant ${data.productName} as ${data.variantName} already exists.`))
      } else {
        next(new ApiError(422, `Record ${data.productId} and ${data.variantId} already exists.`))
      }
    }
  }).catch(err => next(new ApiError(422, `Couldn't create variant.`, err)))
}

//Update a Data
exports.updateData = function (req, res, next) {
  console.log('Requesting-updateData: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  dataExistsVariantCode(data).then(existsVariant => {
    if (!existsVariant) {
      return dataExistsCode(data).then(existsCode => {
        if (!existsCode) {
          return dataExists(id).then(exists => {
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
        } else {
          next(new ApiError(422, `Record ${data.productId} and ${data.variantId} already exists.`))
        }
      }).catch(err => next(new ApiError(422, `Couldn't create variant.`, err)))
    } else {
      next(new ApiError(422, `Record ${data.productId} and ${data.variantId} already exists.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't create variant.`, err)))
}

// Delete a Record
exports.deleteData = function (req, res, next) {
  console.log('Requesting-deleteData: ' + req.url + ' ...')
  const id = req.params.id
  dataExists(id).then(exists => {
    if (exists) {
      const userLogIn = extractTokenProfile(req)
      return deleteData(id, userLogIn.userid).then((stockDeleted) => {
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
