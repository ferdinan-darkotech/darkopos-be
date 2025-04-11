import {
  srvCreateVoucherPackage, srvGetVoucherPackageDetail, srvGetVoucherPackageHeaderByCode, srvGetVoucherPackageHeader, srvUpdateVoucherPackage
} from '../../../services/v2/master/srvVoucherPackage'
import {
  srvGetVoucherHeaderByCode
} from '../../../services/v2/master/srvVoucher'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'

export function ctlGetVoucherPackageHeader (req, res, next) {
  return srvGetVoucherPackageHeader(req.query).then(voucherHeader => {
    res.xstatus(200).json({
      success: true,
      data: voucherHeader.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: voucherHeader.count,
    })
  }).catch(err => next(new ApiError(422, `ZSVPKG-00001: Couldn't find package`, err)))
}

export function ctlGetVoucherPackageDetail (req, res, next) {
  return srvGetVoucherPackageDetail(req.params.code, req.query.mode).then(voucherDetail => {
    res.xstatus(200).json({
      success: true,
      data: voucherDetail,
      total: voucherDetail.length,
    })
  }).catch(err => next(new ApiError(422, `ZSVPKG-00002: Couldn't find package detail`, err)))
}

export function ctlCreateVoucherPackage (req, res, next) {
  const { detail = [], ...other } = req.body
  const userLogin = extractTokenProfile(req)
  const voucherCode = detail.map(i => i.vouchercode)
  return srvGetVoucherHeaderByCode(voucherCode, 'all').then(voucherDetail => {
    if(voucherDetail.length !== voucherCode.length) {
      throw new Error('Some products doesn\'t exists')
    } else {
      let newDetail = []
      let isValid = true 
      for(let z in voucherDetail) {
        const { id: voucherid, vouchercode } = voucherDetail[z]
        const curQty = detail.filter(x => x.vouchercode === vouchercode)[0] || {}
        if(curQty.qty) { 
          newDetail.push({ voucherid, qty: curQty.qty })
        } else {
          isValid = false
          break
        }
      }
      if(isValid) {
        const newData = { detail: newDetail, ...other }
        return srvCreateVoucherPackage(newData, userLogin.userid, next).then(created => {
          if(!created.success) { throw new Error (created.message) }
          else {
            res.xstatus(200).json({
              success: true,
              message: created.message
            })
          }
        }).catch(err => next(new ApiError(422, `ZSVPKG-00004: Couldn't create package`, err)))
      } else {
        throw new Error('Some products doesn\'t exists')
      }
    }
  }).catch(err => next(new ApiError(422, `ZSVPKG-00003: Couldn't create package`, err)))
}

export function ctlUpdateVoucherPackage (req, res, next) {
  const { detail = [], ...other } = req.body
  const vouchercode = req.params.code
  const userLogin = extractTokenProfile(req)

  return srvGetVoucherPackageHeaderByCode(vouchercode).then(exists => {
    const { id: headerid } = exists || {}
    if(!headerid ) { throw new Error('Voucher Package doesn\'t exists') }
    else {
      if(!allowedit) {
        throw new Error('Voucher Package is non editable')
      } else {
        const newData = { service: services, product: products, headerid, ...other }
        return srvUpdateVoucherPackage(newData, userLogin.userid).then(updated => {
          if(!updated.success) { throw new Error (updated.message) }
          else {
            res.xstatus(200).json({
              success: true,
              message: updated.message
            })
          }
        }).catch(err => next(new ApiError(422, `ZSVPKG-00004: Couldn't update package`, err)))
      }
    }
  }).catch(err => next(new ApiError(422, `ZSVPKG-00004: Couldn't update package`, err)))
}