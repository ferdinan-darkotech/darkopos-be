import moment from 'moment'
import {
  srvCreatePointHistory, srvCreateCustomerCoupon, srvGetCustomerCouponByMemberAndPlat,
  srvGetCustomerCouponByMemberCode, srvGetSomeCustomerCoupon, srvGetHistoryCouponClaim,
  srvGetHistorySalesIncludeCoupon, srvGetReportCustomerPointReceived,
  srvGetReportCustomerPointUsed, srvInsertManualCustomerPoint
} from '../../../services/v2/transaction/srvTransCustomerCoupon'
import { srvGetStoreBranch } from '../../../services/v2/master/store/srvStore'
import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  srvGetAssetByMemberAndNo
} from '../../../services/v2/master/customer/srvCustomerAsset'
import { srvGetSomeStockOnHand } from '../../../services/v2/inventory/srvStocks'
import { getSomeServiceByCode } from '../../../services/service/serviceService'


export async function ctlGetReportCustomerPointReceived (req, res, next) {
  console.log('Requesting-ctlGetReportCustomerPointReceived: ' + req.url + ' ...')
  const { store } = req.$userAuth
  const storeInfo = await srvGetStoreBranch(store)
  return srvGetReportCustomerPointReceived(storeInfo.parent_store_id, req.body).then(reportReceive => {
    res.xstatus(200).json({
      success: true,
      data: (reportReceive || []),
      total: reportReceive.length,
    })
  }).catch(err => next(new ApiError(422, `ZTCCP-00000.1: Couldn't get report customer receive point`, err)))
}

export async function ctlGetReportCustomerPointUsed (req, res, next) {
  console.log('Requesting-ctlGetReportCustomerPointUsed: ' + req.url + ' ...')
  const { store } = req.$userAuth
  const storeInfo = await srvGetStoreBranch(store)

  return srvGetReportCustomerPointUsed(storeInfo.parent_store_id, req.body).then(reportUsed => {
    res.xstatus(200).json({
      success: true,
      data: (reportUsed || []),
      total: reportUsed.length,
    })
  }).catch(err => next(new ApiError(422, `ZTCCP-00000.2: Couldn't get report customer used point`, err)))
}

export async function ctlGetSomeCustomerCoupon (req, res, next) {
  console.log('Requesting-ctlGetSomeCustomerCoupon: ' + req.url + ' ...')
  const { ...otherQuery } = req.query
  const { store } = req.$userAuth
  const storeInfo = await srvGetStoreBranch(store)

  const newQuery = { ...otherQuery, ho_id: storeInfo.parent_store_id }
  return srvGetSomeCustomerCoupon(newQuery).then(custCoupon => {
    res.xstatus(200).json({
      success: true,
      data: custCoupon.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 25,
      total: custCoupon.count,
    })
  }).catch(err => next(new ApiError(422, `ZTCCP-00001: Couldn't create customer coupon`, err)))
}


export async function ctlGetCustomerCouponByMemberCode (req, res, next) {
  console.log('Requesting-ctlGetCustomerCouponByMemberCode: ' + req.url + ' ...')
  const { store } = req.$userAuth
  const storeInfo = await srvGetStoreBranch(store)

  const newQuery = { ...req.params, ho_id: storeInfo.parent_store_id }
  return srvGetCustomerCouponByMemberCode(newQuery.ho_id, newQuery.member, req.query.m).then(custCoupon => {
    res.xstatus(200).json({
      success: true,
      data: (custCoupon || []),
      total: custCoupon.length,
    })
  }).catch(err => next(new ApiError(422, `ZTCCP-00002: Couldn't create customer coupon`, err)))
}


export async function ctlGetCustomerCouponByMemberAndPlat (req, res, next) {
  console.log('Requesting-ctlGetCustomerCouponByMemberAndPlat: ' + req.url + ' ...')
  const { store } = req.$userAuth
  const storeInfo = await srvGetStoreBranch(store)

  const newQuery = { ...req.params, ho_id: storeInfo.parent_store_id }
  return srvGetCustomerCouponByMemberAndPlat(newQuery.ho_id, newQuery.member, newQuery.policeno, req.query.m).then(custCoupon => {
    res.xstatus(200).json({
      success: true,
      data: (custCoupon || {})
    })
  }).catch(err => next(new ApiError(422, `ZTCCP-00003: Couldn't create customer coupon`, err)))
}

export async function ctlCreateCustomerCoupon (req, res, next) {
  console.log('Requesting-srvCreateCustomerCoupon: ' + req.url + ' ...')
  const { ...otherData } = req.body
  const userLogin = req.$userAuth
  const storeInfo = await srvGetStoreBranch(userLogin.store)

  const newQuery = {
    ...req.params,
    ho_id: storeInfo.parent_store_id
  }
  return srvGetCustomerCouponByMemberAndPlat(newQuery.ho_id, newQuery.member, newQuery.policeno, 'mf').then(async custCoupon => {
    const memberInfo = await srvGetAssetByMemberAndNo(newQuery.member, newQuery.policeno)
    if(!(memberInfo || {}).id) throw new Error('Data member tidak ditemukan.')
    const coupon = (custCoupon || {})
    const newPayload = {
      ...otherData,
      ho_id: newQuery.ho_id,
      store_id: storeInfo.store_id,
      member_id: memberInfo.memberid,
      policeno_id: memberInfo.id,
      user: userLogin.userid
    }
    return srvCreateCustomerCoupon(coupon.id, newPayload).then(created => {
      if(created.success) {
        res.xstatus(200).json({
          success: true,
          message: 'Coupon success has been modifier.'
        })
      } else {
        throw created.message
      }
      
    }).catch(err => next(new ApiError(422, `ZTCCP-00005: Couldn't create customer coupon`, err)))
  }).catch(err => next(new ApiError(422, `ZTCCP-00004: Couldn't create customer coupon`, err)))
}

export async function ctlGetHistorySalesIncludeCoupon (req, res, next) {
  console.log('Requesting-ctlGetHistorySalesIncludeCoupon: ' + req.url + ' ...')
  return srvGetHistorySalesIncludeCoupon(req.params.coupon, true).then(custCoupon => {
    res.xstatus(200).json({
      success: true,
      data: (custCoupon || []),
      total: custCoupon.length,
    })
  }).catch(err => next(new ApiError(422, `ZTCCP-00006: Couldn't create customer coupon`, err)))
}

export async function ctlGetHistoryCouponClaim (req, res, next) {
  console.log('Requesting-ctlGetHistoryCouponClaim: ' + req.url + ' ...')
  const { store } = req.$userAuth
  const storeInfo = await srvGetStoreBranch(store)

  const newQuery = { ...req.params, ho_id: storeInfo.parent_store_id }
  return srvGetHistoryCouponClaim(req.params.coupon, true).then(custCoupon => {
    res.xstatus(200).json({
      success: true,
      data: (custCoupon || []),
      total: custCoupon.length,
    })
  }).catch(err => next(new ApiError(422, `ZTCCP-00006: Couldn't create customer coupon`, err)))
}


export async function ctlInsertManualCustomerPoint (req, res, next) {
  console.log('Requesting-ctlInsertManualCustomerPoint: ' + req.url + ' ...')
  return srvInsertManualCustomerPoint(req.body).then(custCoupon => {
    if(custCoupon.success) {
      res.xstatus(200).json({
        success: true,
        data: custCoupon.data
      })
    } else {
      throw custCoupon.message
    }
  }).catch(err => next(new ApiError(422, `ZTCCP-00006: Couldn't create customer coupon`, err)))
}

export async function ctlVerifiedCouponItems (req, res, next) {
  console.log('Requesting-ctlVerifiedCouponItems: ' + req.url + ' ...')
  const { store } = req.$userAuth
  return srvGetStoreBranch(store).then(async stores => {
    if(!stores.store_id) throw new Error('Store is not found.')

    const dataItems = req.body.items
    const detailProducts = dataItems.filter(x => x.type_code === 'P')
    const detailServices = dataItems.filter(x => x.type_code === 'S')
  
    const getProducts = await srvGetSomeStockOnHand(detailProducts.map(x => x.item_code), stores.store_id, 'mf')
    const getServices = await getSomeServiceByCode(detailServices.map(x => x.item_code), stores.store_id)
    const parseServices = JSON.parse(JSON.stringify(getServices))

    // Check qty products.
    let checkProducts = null
    let newItemProducts = []
    let newItemServices = []
    for(let x in detailProducts) {
      const items = detailProducts[x]
      const currProduct = (getProducts.filter(z => z.productcode === items.item_code)[0] || {})
      if(!currProduct.productcode) {
        checkProducts = `Data product ${items.item_code} is not found.`
        break
      } else if (items.qty_receive > currProduct.qtyonhand) {
        checkProducts = `Data product ${items.item_code} out of stocks.`
        break
      }
      newItemProducts.push({
        barcode01: currProduct.barcode01,
        brandname: currProduct.brandname,
        costprice: currProduct.costprice,
        curr_hpp: currProduct.curr_hpp,
        distprice01: currProduct.distprice01,
        sellprice: currProduct.sellprice,
        distprice02: currProduct.distprice02,
        max_disc: currProduct.max_disc,
        max_disc_nominal: currProduct.max_disc_nominal,
        productcode: currProduct.productcode,
        productname: currProduct.productname,
        qtyonhand: currProduct.qtyonhand,
        qty_receive: 1,
        point_needed: items.point_needed
      })
    }

    for(let x in detailServices) {
      const items = detailServices[x]
      const currService = (parseServices.filter(z => z.serviceCode === items.item_code)[0] || {})
      if(!currService.serviceCode) {
        checkProducts = `Data service ${items.item_code} is not found.`
        break
      }
      newItemServices.push({
        ...currService,
        qty_receive: 1,
        point_needed: items.point_needed
      })
    }

    if(!!checkProducts) {
      throw new Error(checkProducts)
    }

    res.xstatus(200).json({
      success: true,
      data: {
        services: newItemServices,
        products: newItemProducts
      }
    })
  }).catch(err => next(new ApiError(422, `ZTCCP-00007: Couldn't verify items.`, err)))
}