import project from '../../../../config/project.config'
import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  srvGetSaleReport, srvGetSalesReportPerMechanic, srvGetReportSSR, srvGetInsentiveReport, srvGetStockMovements, srvGetFocusProducts,
  srvSalesReportByTireSize, srvLastHistoryMemberSales, srvSalesPerUnitBrand, srvSalesPerUnitType, srvGetLastTransVerifiedMember
} from '../../../services/v2/report/srvSaleReport'
import { extractTokenProfile } from '../../../services/v1/securityService'


exports.ctlGetReportSale = function (req, res, next) {
  console.log('Requesting-ctlGetReportSale: ' + JSON.stringify(req.params) + ' ...')
  const params = req.params.storeCode || null
  try{
    srvGetSaleReport(req.query).then((rs) => {
      res.xstatus(200).json({
        success: true,
        data: rs || [],
        grandTotal: rs.length > 1 ? rs.reduce((sum,x) => sum + x.netto, 0) : 0,
        length: (rs || []).length
      })
    })
  } catch (er) { next(new ApiError(500, 'Server has no response ..')) }
}

const ctlGetSaleByMechanics = function (req, res, next) {
  console.log('Req nya :',req.query)
  try{
    srvGetSalesReportPerMechanic(req.query).then((sales) => {
      res.xstatus(200).json({
        success: true,
        data: sales || [],
        length: (sales || []).length
      })
    })
  } catch (er) { next(new ApiError(500, 'Server has no response ..')) }
}

const ctlGetReportSSR = function (req,res,next) {
  console.log('Requesting-ctlGetReportSSR: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
  return srvGetReportSSR(req.query, userLogIn.userid).then(result => {
    const mainSSR = JSON.parse(JSON.stringify(result[0]))[0]
    const otherSSR = JSON.parse(JSON.stringify(result[1]))[0]
    res.xstatus(200).json({
      data: {
        main: mainSSR,
        other: otherSSR
      },
      success: true
    })
  }).catch (er => next(new ApiError(500, 'Couldn\'t find report'))) 
}

const ctlGetInsentiveReport = function (req,res,next) {
  console.log('Requesting-ctlGetInsentiveReport: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
  return srvGetInsentiveReport(req.query, userLogIn.userid).then(result => {
    const insentiveReport = JSON.parse(JSON.stringify(result))[0]
    res.xstatus(200).json({
      data: insentiveReport,
      success: true
    })
  }).catch (er => next(new ApiError(500, 'Couldn\'t find report'))) 
}

const ctlGetStockMovements = function (req,res,next) {
  console.log('Requesting-srvGetStockMovements: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
  return srvGetStockMovements(req.query, userLogIn.userid).then(result => {
    const mvmStockReport = JSON.parse(JSON.stringify(result))[0]
    res.xstatus(200).json({
      data: mvmStockReport,
      success: true
    })
  }).catch (er => next(new ApiError(500, 'Couldn\'t find report'))) 
}

const ctlGetFocusProducts = function (req,res,next) {
  console.log('Requesting-ctlGetFocusProducts: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
  return srvGetFocusProducts(req.query, userLogIn.userid).then(result => {
    const focusProducts = JSON.parse(JSON.stringify(result))[0]
    res.xstatus(200).json({
      data: focusProducts,
      success: true
    })
  }).catch (er => next(new ApiError(500, 'Couldn\'t find report'))) 
}


const ctlSalesReportByTireSize = function (req,res,next) {
  console.log('Requesting-ctlSalesReportByTireSize: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
  return srvSalesReportByTireSize(req.query, userLogIn.userid).then(result => {
    const salesTireSize = (JSON.parse(JSON.stringify(result))[0][0] || {})
    const sources = salesTireSize.datasource
    const cols = salesTireSize.datacols
    res.xstatus(200).json({
      data: {
        sources,
        cols
      },
      success: true
    })
  }).catch (er => next(new ApiError(500, 'Couldn\'t find report'))) 
}

const ctlLastHistoryMemberSales = function (req,res,next) {
  console.log('Requesting-ctlLastHistoryMemberSales: ' + JSON.stringify(req.params) + ' ...')
  return srvLastHistoryMemberSales(req.query).then(result => {
    const lastHistoryMember = (JSON.parse(JSON.stringify(result))[0] || {})
    res.xstatus(200).json({
      data: lastHistoryMember,
      success: true
    })
  }).catch (er => next(new ApiError(500, 'Couldn\'t find report'))) 
}

const ctlSalesPerUnitType = function (req,res,next) {
  console.log('Requesting-ctlSalesPerUnitType: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
  return srvSalesPerUnitType(req.query, userLogIn.userid).then(result => {
    const perUnitType = (JSON.parse(JSON.stringify(result))[0] || {})
    res.xstatus(200).json({
      data: perUnitType,
      success: true
    })
  }).catch (er => next(new ApiError(500, 'Couldn\'t find report'))) 
}

const ctlSalesPerUnitBrand = function (req,res,next) {
  console.log('Requesting-ctlSalesPerUnitBrand: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
  return srvSalesPerUnitBrand(req.query, userLogIn.userid).then(result => {
    const perUnitBrand = (JSON.parse(JSON.stringify(result))[0] || {})
    res.xstatus(200).json({
      data: perUnitBrand,
      success: true
    })
  }).catch (er => next(new ApiError(500, 'Couldn\'t find report'))) 
}

const ctlGetLastTransVerifiedMember = function (req,res,next) {
  console.log('Requesting-GetLastTransVerifiedMember: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
  return srvGetLastTransVerifiedMember(userLogIn.userid, req.body).then(result => {
    const lastTransMember = (JSON.parse(JSON.stringify(result))[0] || {})
    res.xstatus(200).json({
      data: lastTransMember,
      success: true
    })
  }).catch (er => next(new ApiError(500, 'Couldn\'t find report'))) 
}

exports.ctlGetReportSaleByType = function (req,res,next) {
  console.log('Requesting-ctlGetReportSaleByType: ' + JSON.stringify(req.params) + ' ...')

  if(req.params.type === 'mechanic') {
    return ctlGetSaleByMechanics(req, res, next)
  } else if (req.params.type === 'ssr') {
    return ctlGetReportSSR(req, res, next)
  } else if (req.params.type === 'insentive') {
    return ctlGetInsentiveReport(req, res, next)
  } else if (req.params.type === 'mvmstock') {
    return ctlGetStockMovements(req, res, next)
  } else if (req.params.type === 'focusprods') {
    return ctlGetFocusProducts(req, res, next)
  } else if (req.params.type === 'slstiresize') {
    return ctlSalesReportByTireSize(req, res, next)
  } else if (req.params.type === 'lasthistorymember') {
    return ctlLastHistoryMemberSales(req, res, next)
  } else if (req.params.type === 'perunittype') {
    return ctlSalesPerUnitType(req, res, next)
  } else if (req.params.type === 'perunitbrand') {
    return ctlSalesPerUnitBrand(req, res, next)
  } else if (req.params.type === 'lsttransverifiedmember') {
    return ctlGetLastTransVerifiedMember(req, res, next)
  } else {
    return next(new ApiError(404, 'Parameter Not Found'))
  }
}

