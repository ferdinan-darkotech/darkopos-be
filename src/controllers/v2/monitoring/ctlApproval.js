import {
  srvGetApproval, srvUpdateApproval, srvGetApprovalOptions, srvGetApprovalProgress, srvEditApprovalAdjustment, srvFindOneApprovalAdjustment,
  srvEditApprovalPurchase, srvFindOneApprovalPurchase, srvGetListApproval
} from '../../../services/v2/monitoring/srvApproval'
import { srvGetSomeStockOnHand } from '../../../services/v2/inventory/srvStocks'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'


export function ctlGetListApproval (req, res, next) {
  console.log('Requesting-ctlGetListApproval: ' + JSON.stringify(req.query) + ' ...')
  return srvGetListApproval(req.query).then(appv => {
    res.xstatus(200).json({
      success: true,
      data: appv
    })
  }).catch(err => next(new ApiError(422, `APPV-00001: Couldn't find Approval`, err.message)))
}

export function ctlGetApprovalOptions (req, res, next) {
  console.log('Requesting-ctlGetApprovalOptions: ' + JSON.stringify(req.query) + ' ...')
  return srvGetApprovalOptions(req.query).then(opt => {
    res.xstatus(200).json({
      success: true,
      data: opt
    })
  }).catch(err => next(new ApiError(422, `APPV-00001: Couldn't find Approval`, err.message)))
}

export async function ctlGetApproval (req, res, next) {
  console.log('Requesting-ctlGetApproval: ' + JSON.stringify(req.query) + ' ...')
  const userLogin = req.$userAuth
  if(req.query.lvl) {
    return srvGetApproval(req.query, userLogin.store).then(result => {
      const rs = JSON.parse(JSON.stringify(result))
      res.xstatus(200).json({
        success: true,
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 1000,
        total: rs.count,
        data: rs.rows
      })
    }).catch(err => next(new ApiError(422, `APPV-00003: Couldn't find Approval`, err.message)))
  } else {
    next(new ApiError(422, `APPV-00002: Level Approval is required`))
  }
}

export async function ctlGetApprovalProgress (req, res, next) {
  console.log('Requesting-ctlGetApprovalProgress: ' + JSON.stringify(req.query) + ' ...')
  return srvGetApprovalProgress(req.query).then(result => {
    const rs = JSON.parse(JSON.stringify(result))
    res.xstatus(200).json({
      success: true,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 20,
      total: rs.data.count,
      data: rs.data.rows
    })
  }).catch(err => next(new ApiError(422, `APPV-00004: Couldn't find Approval`, err.message)))
}


export function ctlUpdateApproval (req, res, next) {
  console.log('Requesting-ctlUpdateApproval: ' + JSON.stringify(req.query) + ' ...')
  const userLogin = extractTokenProfile(req)
  return srvUpdateApproval(req.body, userLogin.userid).then(rs => {
    res.xstatus(200).json({
      success: true,
      message: 'Approval has been updated',
      detail: rs
    })
  }).catch(err => next(new ApiError(422, `APPV-00005: Couldn't update Approval`, err.message)))
}

function editApprovalAdjustment (req, res, next, userLogin) {
  const appvid = req.body.appvid
  const storeId = (req.body.data || {}).storeId
  return srvFindOneApprovalAdjustment(appvid).then(approval => {
    if(!approval) {
      throw new Error('No Data Found')
    } else {
      if(approval.appvstatus.split(',').indexOf('R') !== -1 || approval.appvstatus.split(',').indexOf('A') !== -1) {
        throw new Error('This transaction has been rejected or approved')
      } else {
        const codeProduct = (req.body.detail || []).map(i => i.product)
        return srvGetSomeStockOnHand(codeProduct, storeId).then(prod => {
          if(prod.length !== codeProduct.length) throw new Error('Please re-check your detail transaction.')
          const newData = { ...req.body.data, appvid: req.body.appvid }

          let newDetail = (req.body.detail || []).map(x => {
            const tmpProduct = (prod.filter(n => x.product === n.productcode)[0] || {})
            const { productid, productcode, productname } = tmpProduct
            const { product, ...other } = x
            return { ...other, productCode: productcode, productId: productid, productName: productname }
          })
          return srvEditApprovalAdjustment(approval.appvpayload, newData, newDetail, userLogin.userid).then(updated => {
            if(updated.success) {
              res.xstatus(200).json({
                success: true,
                message: "Approval has been updated ..."
              })
            } else {
              throw new Error(updated.message)
            }
          }).catch(err => next(new ApiError(422, `APPV-00009: Couldn't update approval`, err.message)))
        }).catch(err => next(new ApiError(422, `APPV-00008: Couldn't update approval`, err.message)))
      }
    }
  }).catch(err => next(new ApiError(422, `APPV-00007: Couldn't update approval`, err.message)))
}

function editApprovalPurchase (req, res, next, userLogin) {
  const appvid = req.body.appvid
  const storeId = (req.body.data || {}).storeId
  const details = [...req.body.add, ...req.body.edit]
  return srvFindOneApprovalPurchase(appvid).then(approval => {
    if(!approval) {
      throw new Error('No Data Found')
    } else {
      if(approval.appvstatus.split(',').indexOf('R') !== -1 || approval.appvstatus.split(',').indexOf('A') !== -1) {
        throw new Error('This transaction has been rejected or approved')
      } else {
        const codeProduct = details.map(i => i.productCode)
        return srvGetSomeStockOnHand(codeProduct, storeId).then(prod => {
          if(prod.length !== codeProduct.length) throw new Error('Please re-check your detail transaction.')
          const newData = { ...req.body.data, appvid: req.body.appvid, transno: (req.body.data || {}).transno || req.body.id }
          let newDetail = details.map(x => {
            const tmpProduct = (prod.filter(n => x.productCode === n.productcode)[0] || {})
            const { productid, productcode, productname } = tmpProduct
            const { product, ...other } = x
            return { ...other, productCode: productcode, productId: productid, productName: productname }
          })
          return srvEditApprovalPurchase(approval.appvpayload, newData, newDetail, userLogin.userid).then(updated => {
            if(updated.success) {
              res.xstatus(200).json({
                success: true,
                message: "Approval has been updated ..."
              })
            } else {
              throw new Error(updated.message)
            }
          }).catch(err => next(new ApiError(422, `APPV-00009: Couldn't update approval`, err.message)))
        }).catch(err => next(new ApiError(422, `APPV-00008: Couldn't update approval`, err.message)))
      }
    }
  }).catch(err => next(new ApiError(422, `APPV-00007: Couldn't update approval`, err.message)))
}


export function ctlEditApproval (req, res, next) {
  console.log('Requesting-ctlEditApproval: ' + JSON.stringify(req.params.type) + ' ...')
  const userLogin = extractTokenProfile(req)
  const params = req.params.type

  if(params === 'ADJUSTMENT') {
    return editApprovalAdjustment(req, res, next, userLogin)
  } else if (params === 'PURCHASE') {
    return editApprovalPurchase(req, res, next, userLogin)
  } else {
    return next(new ApiError(422, `APPV-00006: Couldn't find type of approval`, err.message))
  }
} 