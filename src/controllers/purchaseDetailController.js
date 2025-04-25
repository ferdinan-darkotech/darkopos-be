import { ApiError } from '../services/v1/errorHandlingService'
import {
    setPurchaseDetailInfo, setReturnDetailInfo, getPurchaseDetailByCode, getPurchaseDetailData,
    createPurchaseDetail, updatePurchaseDetail, createPurchaseVoidDetail,
    getPurchaseDetailService
}
    from '../services/purchaseDetailService'
import { extractTokenProfile } from '../services/v1/securityService'

// [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
exports.getPurchaseDetailService = function (req, res, next) {
  console.log('Requesting-getPurchaseDetailService: ' + req.body + ' ...')
  const { storeid, productid } = req.params

  let { pageSize, page, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }

  getPurchaseDetailService(storeid, productid, pagination, other).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: pageSize || 10,
      page: page || 1,
      total: data.count,
      data: JSON.parse(JSON.stringify(data.rows))
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Purchase Detail.`, err)))
}

// Retrive list a purchase
exports.getPurchaseDetail = function (req, res, next) {
  console.log('Requesting-getPurchaseDetail: ' + req.body + ' ...')
  const { transNo, storeId } = req.query
  getPurchaseDetailByCode(transNo, storeId).then((PurchaseDetail) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: PurchaseDetail
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Purchase Detail ${transNo}.`, err)))
}

// Retrive list of purchasedetail
exports.getAllPurchaseDetail = function (req, res, next) {
  console.log('Requesting-getAllPurchaseDetail: ' + req.body + ' ...')
  let { pageSize, page, ...other } = req.query
  return getPurchaseDetailData(other).then((purchase) => {
      res.xstatus(200).json({
          success: true,
          message: 'Ok',
          data: JSON.parse(JSON.stringify(purchase)),
          total: purchase.length
      })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Purchase Detail.`, err)))
}

// Create a new purchase
exports.insertPurchaseDetail = function (req, res, next) {
    console.log('Requesting-insertPurchaseDetail: ' + req.body + ' ...')
    next(new ApiError(299, 'Deprecated API please refresh.'))
    // const transNo = req.body.id
    // let purchase = req.body.data
    // const userLogIn = extractTokenProfile(req)
    // return createPurchaseDetail(transNo, purchase, userLogIn.userid, next).then((purchaseDetailCreated) => {
    //     return getPurchaseDetailByCode(purchaseDetailCreated.transNo, purchase.storeId).then((purchaseByCode) => {
    //         let purchaseInfo = setPurchaseDetailInfo(purchaseByCode)
    //         let jsonObj = {
    //             success: true,
    //             message: `PURCHASE DETAIL ${transNo} created`,
    //             data: purchase
    //         }
    //         res.xstatus(200).json(jsonObj)
    //     }).catch(err => next(new ApiError(422, err + `Couldn't find purchase ${transNo}.`, err)))
    // }).catch(err => next(new ApiError(501, `Couldn't create purchase ${transNo}.`, err)))
}

exports.insertPurchaseVoidDetail = function (req, res, next) {
    console.log('Requesting-insertPurchaseVoidDetail: ' + req.body + ' ...')
    next(new ApiError(299, 'Deprecated API please refresh.'))
    // const transNo = req.body.id
    // let purchase = req.body.data
    // const userLogIn = extractTokenProfile(req)
    // return createPurchaseVoidDetail(transNo, purchase, userLogIn.userid, next).then((purchaseDetailCreated) => {
    //     return getPurchaseDetailByCode(purchaseDetailCreated.transNo, purchase.storeId).then((purchaseByCode) => {
    //         let purchaseInfo = setPurchaseDetailInfo(purchaseByCode)
    //         let jsonObj = {
    //             success: true,
    //             message: `PURCHASE Void ${transNo} created`,
    //             data: purchase
    //         }
    //         res.xstatus(200).json(jsonObj)
    //     }).catch(err => next(new ApiError(422, err + `Couldn't find purchase ${transNo}.`, err)))
    // }).catch(err => next(new ApiError(501, `Couldn't create purchase ${transNo}.`, err)))
}

//create new return
exports.insertReturnDetail = function (req, res, next) {
    console.log('Requesting-insertPurchaseDetail: ' + req.body + ' ...')
    const transNo = req.body.id
    let purchase = req.body.data
    const userLogIn = extractTokenProfile(req)
    return createPurchaseDetail(transNo, purchase, userLogIn.userid, next).then((purchaseDetailCreated) => {
        return getPurchaseDetailByCode(purchaseDetailCreated.transNo, purchase.storeId).then((purchaseByCode) => {
            let purchaseInfo = setReturnDetailInfo(purchaseByCode)
            let jsonObj = {
                success: true,
                message: `PURCHASE DETAIL ${transNo} created`,
                data: purchase
            }
            res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find purchase ${transNo}.`, err)))
    }).catch(err => next(new ApiError(501, `Couldn't create purchase ${transNo}.`, err)))
}

exports.updatePurchaseDetail = function (req, res, next) {
    console.log('Requesting-updatePurchaseDetail: ' + req.body + ' ...')
    const transNo = req.body.id
    let purchase = req.body.data
    const userLogIn = extractTokenProfile(req)
    return updatePurchaseDetail(transNo, purchase, userLogIn.userid, next).then((purchaseDetailCreated) => {
        res.xstatus(200).json(purchaseDetailCreated)
    }).catch(err => next(new ApiError(501, `Couldn't create purchase ${transNo}.`, err)))
}

