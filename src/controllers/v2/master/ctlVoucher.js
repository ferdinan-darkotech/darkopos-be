import {
  srvCreateVoucher, srvGetVoucherDetail, srvGetVoucherHeaderByCode, srvGetVoucherHeader, srvUpdateVoucher
} from '../../../services/v2/master/srvVoucher'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetSomeStockOnHand } from '../../../services/v2/inventory/srvStocks'
import { getSomeServiceByCode } from '../../../services/service/serviceService'

export function ctlGetVoucherHeader (req, res, next) {
  return srvGetVoucherHeader(req.query).then(voucherHeader => {
    res.xstatus(200).json({
      success: true,
      data: voucherHeader.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: voucherHeader.count,
    })
  }).catch(err => next(new ApiError(422, `ZSVC-00001: Couldn't find voucher`, err)))
}

export function ctlGetVoucherDetail (req, res, next) {
  return srvGetVoucherDetail(req.params.code).then(voucherDetail => {
    const data = {
      products: voucherDetail[0] || [],
      services: voucherDetail[1] || []
    }
    res.xstatus(200).json({
      success: true,
      data,
      total: voucherDetail.length,
    })
  }).catch(err => next(new ApiError(422, `ZSVC-00002: Couldn't find voucher detail`, err)))
}

export function ctlCreateVoucher (req, res, next) {
  const { services, products, ...other } = req.body
  const userLogin = req.$userAuth
  const productCode = products.map(i => i.productcode)
  const serviceCode = services.map(i => i.servicecode)
  const dataProduct = srvGetSomeStockOnHand(productCode, other.storeid)
  const dataService = getSomeServiceByCode(serviceCode, other.storeid)
  return Promise.all([dataProduct, dataService]).then(val => {
    if(other.vouchertype !== '001' && (other.vouchernominal <= 0)) {
      throw new Error('Except Voucher type (Base on Item) value of nominal or payment must be greater than 0')
    } else {
      const [product, service] = val
    if(productCode.length !== product.length || serviceCode.length !== service.length) {
      if(productCode.length !== product.length) throw new Error ('Some products doesn\'t exists')
        else if(serviceCode.length !== service.length) throw new Error ('Some services doesn\'t exists')
      } else {
        const newData = { service, product, ...other }
        return srvCreateVoucher(newData, userLogin.userid, next).then(created => {
          if(!created.success) { throw new Error (created.message) }
          else {
            res.xstatus(200).json({
              success: true,
              message: created.message
            })
          }
        }).catch(err => next(new ApiError(422, `ZSVC-00004: Couldn't create voucher`, err)))
      } 
    }
  }).catch(err => next(new ApiError(422, `ZSVC-00003: Couldn't create voucher`, err)))
}

export function ctlUpdateVoucher (req, res, next) {
  const { services, products, ...other } = req.body
  const vouchercode = req.params.code
  const userLogin = req.$userAuth

  return srvGetVoucherHeaderByCode(vouchercode).then(exists => {
    const { id: headerid, allowedit } = exists || {}
    if(!headerid ) { throw new Error('Voucher doesn\'t exists') }
    else {
      if(!allowedit) {
        throw new Error('Voucher is editless')
      } else {
        const newData = { service: services, product: products, headerid, ...other }
        return srvUpdateVoucher(newData, userLogin.userid).then(updated => {
          if(!updated.success) { throw new Error (updated.message) }
          else {
            res.xstatus(200).json({
              success: true,
              message: updated.message
            })
          }
        }).catch(err => next(new ApiError(422, `ZSVC-00004: Couldn't update voucher`, err)))
      }
    }
  }).catch(err => next(new ApiError(422, `ZSVC-00004: Couldn't update voucher`, err)))
}