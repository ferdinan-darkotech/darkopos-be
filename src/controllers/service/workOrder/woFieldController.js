import project from '../../../../config/project.config'
import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  getDataId, getData, countData, insertData, updateData, deleteData,
  dataExists, dataExistsCode, swapIndex, getDataCodeMax, getDataFieldById
} from '../../../services/service/workorder/woFieldService'
import { extractTokenProfile } from '../../../services/v1/securityService'

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
  console.log('Requesting-getDataWo06: ' + req.url + ' ...')
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
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  dataExistsCode(data).then(async exists => {
    let listRelation = []
    if(Array.isArray(data.relationid) && data.relationid.length > 0) {
      listRelation = await getDataFieldById(data.relationid)
    }
    
    const newRelation = (data.relationid || []).filter(x => x !== null)
    if(listRelation.length === newRelation.length) {
      data.relationid = newRelation
      if (!exists) {
        return getDataCodeMax(data).then(result => {
          data.sortingIndex = (result.sortingIndex || 0) + 1
          return insertData(data, userLogIn.userid, next).then((created) => {
            if (created.success) {
              let jsonObj = {
                success: true,
                message: created.message,
              }
              if (project.message_detail === 'ON') { Object.assign(jsonObj, { data: created }) }
              res.xstatus(200).json(jsonObj)
            } else {
              throw new Error(created.message)
            }
          }).catch(err => next(new ApiError(501, `Couldn't create wo.`, err)))
        })
      } else {
        next(new ApiError(422, `Record ${data.fieldName} already exists.`))
      }
    } else {
      throw new Error('Relation cannot be match')
    }
  }).catch(err => next(new ApiError(501, `Couldn't create wo.`, err)))
}

//Update a Data
exports.updateData = function (req, res, next) {
  console.log('Requesting-updateDataWOField: ' + req.url + ' ...')
  const id = req.params.id
  console.log('id', id)
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  getDataId(id).then(async exists => {
    let listRelation = []
    if(Array.isArray(data.relationid) && data.relationid.length > 0) {
      listRelation = await getDataFieldById(data.relationid)
    }

    const newRelation = (data.relationid || []).filter(x => x !== null)
    if(listRelation.length === newRelation.length) {
      data.relationid = newRelation
      if (exists) {
        return updateData(id, data, userLogIn.userid).then((updated) => {
          if (updated.success) {
            let jsonObj = {
              success: true,
              message: updated.message,
            }
            res.xstatus(200).json(jsonObj)
          } else {
            throw new Error(updated.message)
          }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
      } else {
        next(new ApiError(422, `Couldn't find Data ${id}.`))
      }
    } else {
      throw new Error('Relation cannot be match')
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

// Delete a Record
exports.deleteData = function (req, res, next) {
  console.log('Requesting-deleteData: ' + req.url + ' ...')
  const id = req.params.id
  const userLogIn = extractTokenProfile(req)
  dataExists(id).then(exists => {
    if (exists) {
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
