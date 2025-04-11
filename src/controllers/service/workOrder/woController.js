import project from '../../../../config/project.config'
import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  getDataId, getData, countData, insertData, updateData, deleteData,
  dataExists, dataExistsCode, getDataMainWo, srvGetWoDetail
} from '../../../services/service/workorder/woService'
import { extractTokenProfile } from '../../../services/v1/securityService'
import moment from 'moment'
import { compareDiffObjects } from '../../../utils/mapping'


exports.ctlGetWoDetail = function (req, res, next) {
  console.log('Requesting-getWoDetail: ' + req.url + ' ...')
  return srvGetWoDetail(req.params.woid, req.query).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs
    })
  }).catch(err => next(new ApiError(422, `Couldn't find data ${req.params.woid}.`, err)))
}
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
  console.log('Requesting-getDataWOs_s: ' + req.url + ' ...')
  
  let { pageSize, page, ...other } = req.query
  const store = other.storeId
  const pagination = {
    pageSize,
    page
  }
  return getDataMainWo({ ...other, store}, pagination).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: pageSize || 10,
      page: page || 1,
      total: data.count,
      data: JSON.parse(JSON.stringify(data.rows))
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
  // return countData({ ...other, store}).then((count) => {
    
  // }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
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
  }).catch(err => next(new ApiError(501, `Couldn't create wo.`, err)))
}

//Update a Data
exports.updateData = function (req, res, next) {
  console.log('Requesting-updateDataWO001: ' + req.url + ' ...')
  const id = req.params.id
  console.log('id', id)
  let data = req.body
  
  const userLogIn = extractTokenProfile(req)
  return srvGetWoDetail(id).then(curr => {
    const { custome: currCustome, checks: currCheck, ...currHeader } = curr
    const { custome: dataCustome, check: dataCheck, header: dataHeader, headerid } = data
    if (curr) {
      const compareHeader = compareDiffObjects(
        currHeader,
        dataHeader,
        { policeno: 'policeNo', gasoline_percent: 'gasoline_percent', vehicle_km: 'vehicle_km' }
      )
      const compareCustome = compareDiffObjects(
        currCustome,
        dataCustome,
        { value: 'value', memo: 'memo', condition: 'condition' },
        { fieldid: 'id' }
      )
      const isChange = (compareHeader || compareCustome)
      data.header.woid = id
      return updateData(id, data, userLogIn.userid, isChange, headerid).then((updated) => {
        if(updated.success) {
          let jsonObj = {
            success: true,
            message: `Data updated`,
            detailModifier: updated.detail,
            checksModifier: updated.checks
          }
          res.xstatus(200).json(jsonObj)
        } else {
          throw new Error(updated.message)
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
      const userLogIn = extractTokenProfile(req)
      return deleteData(id, userLogIn.userid, next).then((stockDeleted) => {
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