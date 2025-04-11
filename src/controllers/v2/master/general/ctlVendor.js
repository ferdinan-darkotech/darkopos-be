import {
  srvGetVendor, srvCreatedVendor, srvUpdatedVendor, srvGetVendorByCode
} from '../../../../services/v2/master/general/srvVendor'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../../services/v1/securityService'

export function ctlGetVendor (req, res, next) {
  console.log('Requesting-ctlGetVendor', req.query)
  return srvGetVendor(req.query).then(cust => {
    res.xstatus(200).json({
      success: true,
      data: cust.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 20,
      total: cust.count
    })
  }).catch(err => next(new ApiError(422, `ERVND-00001: Couldn't find vendor`, err)))
}

export function ctlCreatedVendor (req, res, next) {
  console.log('Requesting-ctlCreatedVendor', req.query)
  const userLogin = extractTokenProfile(req)
  const data = req.body
  return srvGetVendorByCode (data.vendor_code).then(exists => {
    if(!!exists) throw new Error(`Data Vendor with code ${vendorCode} already exists.`)

    return srvCreatedVendor(req.body, userLogin.userid).then(crt => {
      res.xstatus(200).json({
        success: true,
        message: `Data has been created`
      })
    }).catch(err => next(new ApiError(422, `ERVND-00003: Couldn't modify vendor`, err)))
  }).catch(err => next(new ApiError(422, `ERVND-00002: Couldn't modify vendor`, err)))
}

export function ctlUpdatedVendor (req, res, next) {
  console.log('Requesting-ctlUpdatedVendor', req.query)
  const userLogin = extractTokenProfile(req)
  const vendorCode = req.params.vendor
  
  return srvGetVendorByCode(vendorCode).then(exists => {
    if(!exists) throw new Error(`Data Vendor with code ${vendorCode} is not exists.`)

    return srvUpdatedVendor({ ...req.body, vendor: vendorCode }, userLogin.userid).then(upd => {
      res.xstatus(200).json({
        success: true,
        message: `Data has been updated`
      })
    }).catch(err => next(new ApiError(422, `ERVND-00005: Couldn't modify vendor`, err)))
  }).catch(err => next(new ApiError(422, `ERVND-00004: Couldn't modify vendor`, err)))
}