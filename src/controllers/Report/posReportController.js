/**
 * Created by Veirry on 18/09/2017.
 */
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getReportPosTrans,
  getReportPosTransMemberHistory,
  getReportPosTransCancel,
  getDailyPos,
  getDetailPos,
  getMemberAssetsReport,
  countData,
  getTurnOver,
  getTurnOverNext,
  srvCompareSalesVsInventory,
  getReportHourlyCustomer,
  getReportHourCustomer,
  getReportHourInterval,
  getReportTransAll,
  getReportTransAllGroup,
  getReportTransRealization,
  getReportPowerBISales,
  getReportPowerBIData,
  getReportPowerBIDataTRM,
  getReportPowerBIDataSSR
} from '../../services/Report/posReportService'
import {
  getMember
} from '../../services/member/memberService'
import project from '../../../config/project.config'
import sequelize from '../../native/sequelize'

exports.getPosReportTrans = function (req, res, next) {
  console.log('Requesting-getPosReportTrans: ' + req.url + ' ...')
  let { from, to, ...other } = req.query
  getReportPosTrans(req.query).then((pos) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(pos)),
      total: pos.length
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find POS Report.`, err)))
}

exports.getReportPosAndService = function (req, res, next) {
  console.log('Requesting-getReportPosAndService: ' + req.url + ' ...')
  return getReportTransAll(req.query).then((pos) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: JSON.parse(JSON.stringify(pos))[0].length,
      data: JSON.parse(JSON.stringify(pos))[0]
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Report.`, err)))
}

exports.getReportPosAndServiceGroup = function (req, res, next) {
  console.log('Requesting-getReportPosAndServiceGroup: ' + req.url + ' ...')
  return getReportTransAllGroup(req.query).then((pos) => {
    if(pos.success) {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: pos.data.length,
        data: pos.data
      })
    } else {
      throw pos.message
    }
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Report.`, err)))
}

exports.getReportRealisasi = function (req, res, next) {
  console.log('Requesting-getReportRealisasi: ' + req.url + ' ...')
  return getReportTransRealization(req.body).then((pos) => {
    if(pos.success) {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: pos.data.length,
        data: pos.data
      })
    } else {
      throw pos.message
    }
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Report.`, err)))
}

exports.getReportSalesPowerBI = function (req, res, next) {
  console.log('Requesting-getReportPowerBISales: ' + req.url + ' ...')
  return getReportPowerBISales(req.body).then((power) => {
    if(power.success) {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: power.data.length,
        data: power.data
      })
    } else {
      throw power.message
    }
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Sales.`, err)))
}

exports.getReportDataPowerBI = function (req, res, next) {
  console.log('Requesting-getReportPowerBIData: ' + req.url + ' ...')
  return getReportPowerBIData(req.body).then((power) => {
    if(power.success) {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: power.data.length,
        data: power.data
      })
    } else {
      throw power.message
    }
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

exports.getReportDataTRMPowerBI = function (req, res, next) {
  console.log('Requesting-getReportPowerBIDataTRM: ' + req.url + ' ...')
  return getReportPowerBIDataTRM(req.body).then((power) => {
    if(power.success) {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: power.data.length,
        data: power.data
      })
    } else {
      throw power.message
    }
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

exports.getReportDataSSRPowerBI = function (req, res, next) {
  console.log('Requesting-getReportPowerBIDataSSR: ' + req.url + ' ...')
  return getReportPowerBIDataSSR(req.body).then((power) => {
    if(power.success) {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: power.data.length,
        data: power.data
      })
    } else {
      throw power.message
    }
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

exports.getPosReportTransCancel = function (req, res, next) {
  console.log('Requesting-getPosReportTransCancel: ' + req.url + ' ...')
  let { from, to, ...other } = req.query
  getReportPosTransCancel(req.query).then((pos) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(pos)),
      total: pos.length
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find POS Report.`, err)))
}

exports.getPosReportDaily = function (req, res, next) {
  console.log('Requesting-getPosReportDaily: ' + req.url + ' ...')
  const userid = req.params.id
  getDailyPos(req.query).then((purch) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      icode: 'POSD-01',
      total: purch.length,
      data: purch
    })
  }).catch(err => next(new ApiError(501, ` - Couldn't find Purchase Report.`, err)))
}

exports.getPosDetailReport = function (req, res, next) {
  console.log('Requesting-getPosDetailReport: ' + req.url + ' ...')
  const userid = req.params.id
  if (!(req.query.from && req.query.to)) {
    return next(new ApiError(422, `Date Parameter is Required`))
  }
  if ((req.query.transNo) && !(req.query.storeId)) {
    return next(new ApiError(422, `StoreId Parameter is Required`))
  }
  if (!(req.query.storeId)) {
    return next(new ApiError(422, `StoreId Parameter is Required`))
  }
  getDetailPos(req.query).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      icode: 'POSD-02',
      total: data.length,
      data: data
    })
  }).catch(err => next(new ApiError(501, ` - Couldn't find Purchase Report.`, err)))
}

exports.getPosReportUnit = function (req, res, next) {
  console.log('Requesting-getPosReportUnit: ' + req.url + ' ...')
  const { memberCode, ...other } = req.query
  if (memberCode) {
    getMember(req.query.memberCode).then((member) => {
      return getReportPosTransMemberHistory(req.query).then((purch) => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          icode: 'UNITPOS-01',
          total: purch.length,
          member: member,
          data: purch
        })
      }).catch(err => next(new ApiError(501, ` - Couldn't find Pos Report.`, err)))
    }).catch(err => next(new ApiError(501, ` - Couldn't find Pos Report.`, err)))
  } else {
    res.xstatus(501).json({
      success: false,
      message: 'No Member Code Parameter Found',
      icode: 'UNPOSF-01',
    })
  }
}

// Retrive list of members
exports.getMemberAssests = function (req, res, next) {
  console.log('Requesting-getMemberAssests: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  countData(other).then((count) => {
    return getMemberAssetsReport(other).then((data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: count,
        data: data
      })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Assets.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Assets.`, err)))
}

// Retrive list of TurnOver
exports.getTurnOver = function (req, res, next) {
  console.log('Requesting-getTurnOver: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  return getTurnOver(other, next).then((data) => {
    return getTurnOverNext(other, next).then((dataNext) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: (data || []).length,
        totalNext: dataNext.length,
        data: data,
        dataNext: dataNext
      })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Assets.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Assets.`, err)))
}


// Retrive sales vs inventory
// sp_nilai_persediaan vs vw_sales_product_inc_spec
exports.getCompareSalesVsInventory = function (req, res, next) {
  console.log('Requesting-getCompareSalesVsInventorys: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  return srvCompareSalesVsInventory(other, next).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: data
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Assets.`, err)))
}

exports.getHourlyCustomer = function (req, res, next) {
  console.log('Requesting-getHourlyCustomer: ' + req.url + ' ...')
  const body = req.body
  const {
    type,
    transDate,
    transTime1,
    transTime2,
    transTime3,
    transTime4,
    transTime5,
    transTime6,
    transTime7,
    transTime8,
    ...other } = body
  const queryBetween = {
    type: type ? type : 'count',
    transDate,
    transTime: {
      transTime1,
      transTime2,
      transTime3,
      transTime4,
      transTime5,
      transTime6,
      transTime7,
      transTime8,
    }
  }
  return getReportHourlyCustomer(queryBetween, other, next).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: (data || []).length,
      data: data,
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Assets.`, err)))
}

exports.getHourCustomer = function (req, res, next) {
  console.log('Requesting-getHourCustomer: ' + req.url + ' ...')
  const body = req.body
  const {
    transDate,
    type,
    ...other } = body
  const queryBetween = {
    transDate,
  }
  return getReportHourCustomer(queryBetween, other, next).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: (data || []).length,
      data: data,
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Assets.`, err)))
}

exports.getIntervalHourCustomer = function (req, res, next) {
  console.log('Requesting-getIntervalHourCustomer: ' + req.url + ' ...')
  const body = req.body
  const {
    transDate,
    type,
    ...other } = body
  const queryBetween = {
    transDate,
  }
  return getReportHourInterval(queryBetween, other, next).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: (data || []).length,
      data: data,
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Assets.`, err)))
}