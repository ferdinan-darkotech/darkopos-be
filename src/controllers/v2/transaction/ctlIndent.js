import moment from 'moment'
import {
  srvGetOneStockIndent, srvCancelStockIndent, srvCreateIndent,
  srvGetSomeStockIndent, srvGetStockIndentDetail, srvUpdateIndent,
  srvGetAllIndentCancelByTrans, srvGetAllIndentCancelDetailByTrans,
  srvGetIndentByMember, srvGetAllIndentDetailByMember,
  srvGetReportSalesIndent, srvGetReportSalesIndentDetail
} from '../../../services/v2/transaction/srvIndent'
import { srvGetSomeStockOnHand } from '../../../services/v2/inventory/srvStocks'
import { srvGetEmployeeByCode } from '../../../services/v2/master/humanresource/srvEmployee'
import { srvGetOneCustomerByCode } from '../../../services/v2/master/customer/srvCustomerList'
import { extractTokenProfile } from '../../../services/v1/securityService'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { getStoreQuery } from '../../../services/setting/storeService'
import { srvGetStoreBranchSetting } from '../../../services/v2/master/store/srvStore'



export function ctlGetAllIndentDetailByMember (req, res, next) {
  console.log('Requesting-ctlGetAllIndentDetailByMember: ' + req.url + ' ...')
  return srvGetAllIndentDetailByMember({ membercode: req.params.member }).then(indent => {
    res.xstatus(200).json({
      success: true,
      data: indent,
      total: indent.length
    })
  }).catch(err => next(new ApiError(422, `ZIDNT-00001: Couldn't get data indent`, err)))
}

export function ctlGetAllIndentByMember (req, res, next) {
  console.log('Requesting-ctlGetAllIndentByMember: ' + req.url + ' ...')
  return srvGetIndentByMember({ membercode: req.params.member }).then(indent => {
    res.xstatus(200).json({
      success: true,
      data: indent,
      total: indent.length
    })
  }).catch(err => next(new ApiError(422, `ZIDNT-00001: Couldn't get data indent`, err)))
}

export function ctlGetExistsStockIndentDetail (req, res, next) {
  console.log('Requesting-ctlGetExistsStockIndentDetail: ' + req.url + ' ...')
  return srvGetStockIndentDetail(req.params.store, req.params.trans, 'bf', true).then(data => {
    res.xstatus(200).json({
      success: true,
      data: data,
      total: data.length
    })
  }).catch(err => next(new ApiError(422, `ZIDNT-00002: Couldn't get data indent`, err)))
}


export function ctlGetAllIndentCancelByTrans (req, res, next) {
  console.log('Requesting-ctlGetAllIndentCancelByTrans: ' + req.url + ' ...')
  return srvGetAllIndentCancelByTrans(req.query).then(indentCancel => {
    res.xstatus(200).json({
      success: true,
      data: indentCancel,
      total: indentCancel.length
    })
  }).catch(err => next(new ApiError(422, `ZIDNT-00001: Couldn't get data indent`, err)))
}

export function ctlGetAllIndentCancelDetailByTrans (req, res, next) {
  console.log('Requesting-ctlGetAllIndentCancelDetailByTrans: ' + req.url + ' ...')
  return srvGetAllIndentCancelDetailByTrans(req.query).then(indentCancel => {
    res.xstatus(200).json({
      success: true,
      data: indentCancel,
      total: indentCancel.length
    })
  }).catch(err => next(new ApiError(422, `ZIDNT-00001: Couldn't get data indent`, err)))
}

export function ctlGetSomeStockIndent (req, res, next) {
  console.log('Requesting-ctlGetSomeStockIndent: ' + req.url + ' ...')
  return srvGetSomeStockIndent(req.query).then(data => {
    res.xstatus(200).json({
      success: true,
      data: data.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 25,
      total: data.count,
    })
  }).catch(err => next(new ApiError(422, `ZIDNT-00001: Couldn't get data indent`, err)))
}

export function ctlGetStockIndentDetail (req, res, next) {
  console.log('Requesting-ctlGetStockIndentDetail: ' + req.url + ' ...')
  return srvGetStockIndentDetail(req.params.store, req.params.trans).then(async data => {
    let tmpData = [...data]
    if(req.query.detailProduct) {
      const listProductCode = data.map(x => x.productcode)
      const descProduct = await srvGetSomeStockOnHand(listProductCode, req.params.store, 'bf')

      let newProduct = []
      for (let x in data) {
        const items = data[x]
        const currentItem = (descProduct.filter(y => y.productcode === items.productcode)[0] || {})

        newProduct.push({
          ...items,
          sellprice: currentItem.sellprice,
          costprice: currentItem.costprice,
          distprice01: currentItem.distprice01,
          distprice02: currentItem.distprice02
        })
      }

      tmpData = newProduct
    }
    res.xstatus(200).json({
      success: true,
      data: tmpData,
      total: tmpData.length
    })
  }).catch(err => next(new ApiError(422, `ZIDNT-00002: Couldn't get data indent`, err)))
}


export function ctlCreateIndent (req, res, next) {
  console.log('Requesting-ctlCreateIndent: ' + req.url + ' ...')
  // productid
  let { details, ...dataPayload } = req.body
  const userInfo = req.$userAuth
  let dataHeaderPayload = {
    ...dataPayload,
    storeid: userInfo.store
  }
  const codeProduct = details.map(i => i.product)
  return srvGetEmployeeByCode(dataPayload.employee).then(emp => {
    const _employe = (emp || {})
    if(!_employe.id) throw new Error('Employee doesn\'t exists.')
    return srvGetOneCustomerByCode(dataPayload.member).then(mbr => {
      const _member = (JSON.parse(JSON.stringify(mbr)) || {})
      if(!_member.id) throw new Error('Member doesn\'t exists.')
      return srvGetSomeStockOnHand(codeProduct, dataHeaderPayload.storeid).then(async prod => {
        if(prod.length !== codeProduct.length) throw new Error('Please re-check your detail transaction.')
        const tmpDetails = details.map((i, x) => {
          const tmpProduct = prod.filter(n => i.product === n.productcode)[0]
          const { productid, productcode } = tmpProduct
          const { product, ...other } = i
          return { ...other, productcode, productid }
        })
        const storeInfo = await srvGetStoreBranchSetting(dataHeaderPayload.storeid)
        const { type: taxType, percent: taxPercent } = ((storeInfo.settingparent || {}).salesTax || {})

        details = tmpDetails
        dataHeaderPayload = {
          ...dataHeaderPayload,
          employeeid: _employe.id,
          memberid: _member.id,
          taxtype: taxType,
          taxval: taxPercent
        }
        return srvCreateIndent(dataHeaderPayload, details, userInfo).then(data => {
          if(!data.success) throw new Error(data.message)
          const { dataHeader } = data
          res.xstatus(200).json({
            success: true,
            data: {
              transno: dataHeader.transno,
              transdate: moment(dataHeader.transdate).format('YYYY-MM-DD')
            },
            message: data.message,
            total: data.length
          })
        }).catch(err => next(new ApiError(422, `ZIDNT-00005: Couldn't create data indent`, err)))
      }).catch(err => next(new ApiError(422, `ZIDNT-00004: Couldn't create data indent`, err)))
    }).catch(err => next(new ApiError(422, `ZIDNT-00003: Couldn't create data indent`, err)))
  }).catch(err => next(new ApiError(422, `ZIDNT-00002: Couldn't create data indent`, err)))
}


export function ctlUpdateIndent (req, res, next) {
  console.log('Requesting-ctlUpdateIndent: ' + req.url + ' ...')
  // productid
  let { details, ...dataPayload } = req.body
  const userInfo = req.$userAuth
  const dataHeaderPayload = {
    ...dataPayload,
    storeid: req.params.store,
    transno: req.params.trans
  }
  const codeProduct = details.map(i => i.product)
  return srvGetOneStockIndent(dataHeaderPayload.storeid, dataHeaderPayload.transno).then(exists => {
    if((exists.total_receiveqty + exists.total_returqty) > 0) throw new Error('Cannot edit data, transaction has been used.')
    if(!exists) throw new Error('Data Indent doesn\'t exists.')
    return srvGetSomeStockOnHand(codeProduct, dataHeaderPayload.storeid).then(prod => {
      if(prod.length !== codeProduct.length) throw new Error('Please re-check your detail transaction.')
      const tmpDetails = details.map((i, x) => {
        const tmpProduct = prod.filter(n => i.product === n.productcode)[0]
        const { productid, productcode } = tmpProduct
        const { product, ...other } = i
        return { ...other, productcode, productid }
      })

      details = tmpDetails
      return srvUpdateIndent(dataHeaderPayload, details, userInfo).then(data => {
        if(!data.success) throw new Error(data.message)
        res.xstatus(200).json({
          success: true,
          data: data.data,
          message: data.message,
          total: data.length
        })
      }).catch(err => next(new ApiError(422, `ZIDNT-00008: Couldn't update data indent`, err)))
    }).catch(err => next(new ApiError(422, `ZIDNT-00007: Couldn't update data indent`, err)))
  }).catch(err => next(new ApiError(422, `ZIDNT-00006: Couldn't update data indent`, err)))
}


export function ctlCancelStockIndent (req, res, next) {
  console.log('Requesting-ctlCancelStockIndent: ' + req.url + ' ...')
  // productid
  let { details, ...dataPayload } = req.body
  const userInfo = req.$userAuth
  const dataHeaderPayload = {
    ...dataPayload,
    storeid: req.params.store,
    transno: req.params.trans
  }
  return srvGetOneStockIndent(dataHeaderPayload.storeid, dataHeaderPayload.transno).then(exists => {
    if(!exists) throw new Error('Data Indent doesn\'t exists.')
    if((exists.dpcost - exists.dpretur) < dataHeaderPayload.dpretur) {
      throw new Error(`DP saat ini ${(exists.dpcost - exists.dpretur)}, DP Retur tidak boleh melebihi DP Cost.`)
    }
    return srvGetStockIndentDetail(req.params.store, req.params.trans, 'mf').then(indentDetail => {
      // if(indentDetail.length !== details.length) throw new Error('Please re-check your detail transaction.')
      const tmpDetails = details.map((i, x) => {
        const tmpProduct = (indentDetail.filter(n => i.product === n.productcode)[0] || {})
        const { productid, productcode, id: detailId, returqty } = tmpProduct
        const { product, ...other } = i
        return { ...other, productcode, productid, id: detailId, returqty: returqty + i.returqty, history_returqty: i.returqty }
      })

      details = tmpDetails

      return srvCancelStockIndent(dataHeaderPayload, details, userInfo).then(data => {
        if(!data.success) throw new Error(data.message)
        res.xstatus(200).json({
          success: true,
          data: data.data,
          message: data.message,
          total: data.length,
          approval: (data.approval || false),
          appvno: data.appvno
        })
      }).catch(err => next(new ApiError(422, `ZIDNT-00011: Couldn't cancel data stock indent`, err)))
    }).catch(err => next(new ApiError(422, `ZIDNT-00010: Couldn't cancel data stock indent`, err)))
  }).catch(err => next(new ApiError(422, `ZIDNT-00009: Couldn't cancel data stock indent`, err)))
}


export async function ctlGetReportSalesIndent (req, res, next) {
  console.log('Requesting-ctlGetReportSalesIndent: ' + req.url + ' ...')
  const { fromDate, toDate } = req.body
  const storeInfo = await getStoreQuery({ storecode: req.params.store || '-' }, 'storebycodeV2')
  const newQuery = { fromDate, toDate, ho_id: (JSON.parse(JSON.stringify(storeInfo))[0] || {}).ho_id }
  return srvGetReportSalesIndent(newQuery).then(reportSalesIndent => {
    const newReportSalesIndent = (JSON.parse(JSON.stringify(reportSalesIndent))[0] || [])
    res.xstatus(200).json({
      success: true,
      data: newReportSalesIndent,
      total: newReportSalesIndent.length,
    })
  }).catch(err => next(new ApiError(422, `ZIDNT-00012: Couldn't get report summary indent`, err)))
}

export async function ctlGetReportSalesIndentDetail (req, res, next) {
  console.log('Requesting-ctlGetReportSalesIndentDetail: ' + req.url + ' ...')
  const { fromDate, toDate } = req.body
  const storeInfo = await getStoreQuery({ storecode: req.params.store || '-' }, 'storebycodeV2')
  const newQuery = { fromDate, toDate, ho_id: (JSON.parse(JSON.stringify(storeInfo))[0] || {}).ho_id, stores: req.body.stores }
  return srvGetReportSalesIndentDetail(newQuery).then(reportSalesIndent => {
    const newReportSalesIndent = (JSON.parse(JSON.stringify(reportSalesIndent))[0] || [])
    res.xstatus(200).json({
      success: true,
      data: (newReportSalesIndent || []),
      total: newReportSalesIndent.length,
    })
  }).catch(err => next(new ApiError(422, `ZIDNT-00012: Couldn't get report detail indent`, err)))
}