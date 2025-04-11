import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { getChangeSellpriceData, getChangeSellpriceHeader, createSellPrice, updateSellPrice, checkStatus, checkStatusForDelete, cancelSellPrice, deleteSellPrice } from '../../services/tools/changeSellpriceService'
import { extractTokenProfile } from '../../services/v1/securityService'

exports.getSellPrice = function (req, res, next) {
  console.log('Requesting-getSellPrice: ' + req.url + ' ...')
  const userLogIn = extractTokenProfile(req)
  const query = {
    status: 0,
    ...req.query
  }
  let { pageSize, page, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
  getChangeSellpriceData(other, pagination, userLogIn.userid).then(data => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: (data || []).length,
      data: data || []
    })
  }).catch(err => next(new ApiError(422, `TS-00001: Couldn't find sellprice.`, err)))
}

exports.getChangeSellpriceHeader = function (req, res, next) {
  console.log('Requesting-getSellPriceHeader: ' + req.url + ' ...')
  const userLogIn = extractTokenProfile(req)
  const query = {
    status: 0,
    ...req.query
  }
  getChangeSellpriceHeader(req.query, userLogIn.userid).then(data => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: (data || []).length,
      data: data || []
    })
  }).catch(err => next(new ApiError(422, `TS-00001: Couldn't find sellprice.`, err)))
}

// Create a new sellprice
exports.insertSellprice = function (req, res, next) {
  let header = req.body.header
  let data = req.body.data
  const userLogIn = extractTokenProfile(req)
  createSellPrice(data, header, userLogIn.userid, next).then(result => {
    console.log('result', result)
    let jsonObj = {
      success: true,
      message: `Sellprice created`,
    }
    if (project.message_detail === 'ON') {
      Object.assign(jsonObj, { data: data })
    }
    res.xstatus(200).json(jsonObj)
  }).catch(err => next(new ApiError(501, `Couldn't create sellprice ${transNo}.`, err)))
}

// Update a new sellprice
exports.updateSellprice = function (req, res, next) {
  console.log('Requesting-updateSellprice: ' + req.url + ' ...')
  let header = req.body.header
  let data = req.body.data
  const userLogIn = extractTokenProfile(req)
  checkStatus(header).then(resultStatus => {
    if (resultStatus) {
      if (resultStatus.status === '0') {
        return updateSellPrice(data, header, userLogIn.userid, next).then(result => {
          let jsonObj = {
            success: true,
            message: `Sellprice updated`,
          }
          if (project.message_detail === 'ON') {
            Object.assign(jsonObj, { data: data })
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update sellprice.`, err)))
      } else if (resultStatus.status === '1') {
        next(new ApiError(409, `Procedure '${resultStatus.transNo}' already updated.`))
      }
    } else {
      next(new ApiError(409, `Procedure is not exists.`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't update sellprice.`, err)))
}

// Update a new sellprice
exports.cancelSellPrice = function (req, res, next) {
  console.log('Requesting-updateSellprice: ' + req.url + ' ...')
  let header = req.params.id
  const userLogIn = extractTokenProfile(req)
  checkStatus({ transNoId: header }).then(resultStatus => {
    if (resultStatus) {
      if (resultStatus.status === '0') {
        return cancelSellPrice(header, userLogIn.userid, next).then(result => {
          let jsonObj = {
            success: true,
            message: `Sellprice canceled`,
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update sellprice.`, err)))
      } else {
        next(new ApiError(409, `Procedure is not exists or already used.`))
      }
    }
  }).catch(err => next(new ApiError(501, `Couldn't update sellprice.`, err)))
}

exports.deleteSellPrice = function (req, res, next) {
  console.log('Requesting-deleteStock: ' + req.url + ' ...')
  checkStatusForDelete(req.body.id).then(resultStatus => {
    console.log('resultStatus', resultStatus)
    if ((resultStatus || []).length > 0) {
      return deleteSellPrice(req.body.id, next).then((deleted) => {
        let jsonObj = {
          success: true,
          message: 'Sellprice deleted',
        }
        if (project.message_detail === 'ON') { Object.assign(jsonObj, { sellprice: deleted }) }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(500, `Couldn't delete Stock sellprice.`, err)))
    } else {
      next(new ApiError(409, `Procedure is not exists or already used.`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't update sellprice.`, err)))
}