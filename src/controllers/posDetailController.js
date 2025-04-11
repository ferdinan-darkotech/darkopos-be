// posController
import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import {
  setPosDetailInfo, getPosDetailByCode, getPosDetailTableByCode, getPosDetailData, getPosReportData,
  createPosDetail, updatePosDetail, deletePosDetail
}
  from '../services/posDetailService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrive list a pos
exports.getPosDetail = function (req, res, next) {
  console.log('Requesting-getPosDetail: ' + req.url + ' ...')
  var transNo = req.params.id
  var storeId = req.query.storeId
  getPosDetailByCode(transNo, storeId).then((PosDetail) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pos: PosDetail
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find POS Detail ${transNo}.`, err)))
}

// Retrive list of posdetail
exports.getAllPosDetail = function (req, res, next) {
  let { pageSize, page, ...other } = req.query
  getPosDetailData(other).then((pos) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(pos)),
      total: pos.length
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Pos Detail.`, err)))
}

exports.getAllPosReport = function (req, res, next) {
  console.log('Requesting-getAllPosReport: ' + req.url + ' ...')
  let { from, to, ...other } = req.query
  getPosReportData(req.query).then((pos) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(pos)),
      total: pos.length
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Pos Report.`, err)))
}

// Create a new pos
exports.insertPosDetail = function (req, res, next) {
  console.log('Requesting-insertPosDetail: ' + req.url + ' ...')
  var transNo = req.params.id
  let pos = req.body
  const userLogIn = extractTokenProfile(req)
  createPosDetail(transNo, pos, userLogIn.userid, next).then((posDetailCreated) => {
    return getPosDetailTableByCode(transNo).then((posByCode) => {
      let posInfo = setPosDetailInfo(posByCode)
      let jsonObj = {
        success: true,
        message: `POS DETAIL ${transNo} created`,
        pos: posInfo,
        total: posInfo.length
      }
      res.xstatus(200).json(jsonObj)
    }).catch(err => next(new ApiError(422, err + `Couldn't find pos ${transNo}.`, err)))
  }).catch(err => next(new ApiError(501, `Couldn't create pos ${transNo}.`, err)))
}

//Update a Data
exports.updatePosDetail = function (req, res, next) {
  console.log('Requesting-updateData: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  return updatePosDetail(id, data, userLogIn.userid).then((updated) => {
    if (updated) {
      res.xstatus(200).json({
        success: true,
        message: `Data updated`,
      })
    }
  })
    .catch(err =>
      next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
}

// Delete a Record
exports.deletePosDetail = function (req, res, next) {
  console.log('Requesting-deleteData: ' + req.url + ' ...')
  const id = req.params.id
  return deletePosDetail(id, next).then((stockDeleted) => {
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
}
