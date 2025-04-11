import srvGetDetailSales, {
  srvGetOneVoucherSalesHeader, srvGetVoucherList, srvGetVoucherSalesHeader, srvInsertVoucherSales,
  srvGetVoucherSalesItem, srvGetVoucherSalesByNo
} from '../../../services/v2/transaction/srvVoucherSales'
import { srvGetSomeStockOnHand } from '../../../services/v2/inventory/srvStocks'
import { getSomeServiceByCode } from '../../../services/service/serviceService'
import { srvGetSomePaymentOptionByCode } from '../../../services/v2/master/finance/srvPaymentOption'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetOneCustomerByCode } from '../../../services/v2/master/customer/srvCustomerList'
import moment from 'moment'

export function ctlGetDetailItem(req, res, next) {
  console.log('Requesting-ctlGetDetailItem: ' + req.url + ' ...')
  const storeid = req.query.store
  return srvGetVoucherSalesByNo(req.params.voucher).then(listItem => {
    if(!storeid) throw new Error('Store cannot found')
    const listProducts = []
    const listServices = []
    listItem.map(x => {
      x.typecode === 'S' ? listServices.push(x.itemcode) : listProducts.push(x.itemcode)
    })
    const getProducts = srvGetSomeStockOnHand(listProducts,storeid,'bf')
    const getServices = getSomeServiceByCode(listServices, storeid)
    return Promise.all([getProducts, getServices]).then(dataItem => {
      res.xstatus(200).json({
        success: true,
        dataProducts: dataItem[0],
        dataServices: dataItem[1]
      })
    }).catch(er => next(new ApiError(422, `ZVCS-00011: Couldn't find Voucher Item`, er)))
  }).catch(er => next(new ApiError(422, `ZVCS-00010: Couldn't find Voucher Item`, er)))
}


export function ctlGetVoucherSalesItem (req, res, next) {
  console.log('Requesting-ctlGetVoucherSalesItem: ' + req.url + ' ...')
  const membercode = req.params.membercode
  const reqType = req.query.type
  if(!req.query.type || ( reqType.indexOf('P') === -1 && reqType.indexOf('S') === -1)) {
    next(new ApiError(422, `ZVCS-00000: Couldn't find Voucher`, er))
  } else {
    return srvGetVoucherSalesItem({ ...req.query, membercode }).then(sales => {
      res.xstatus(200).json({
        success: true,
        data: sales,
        total: sales.length
      })
    }).catch(er => next(new ApiError(422, `ZVCS-00000: Couldn't find Voucher`, er)))
  }
}

export function ctlGetVoucherList (req, res, next) {
  console.log('Requesting-ctlGetVoucherList: ' + req.url + ' ...')
  const { mode, ...otherQuery } = req.query
  return srvGetVoucherList(otherQuery, mode).then(list => {
    res.xstatus(200).json({
      success: true,
      data: mode === 'params' ? list : list.rows,
      total: mode === 'params' ? list.length : list.count,
      page: req.query.page || 1,
      pageSize: req.query.pageSize || 10
    })
  }).catch(er => next(new ApiError(422, `ZVCS-00001: Couldn't find Voucher`, er)))
}

export function ctlGetVoucherSalesHeader (req, res, next) {
  console.log('Requesting-ctlGetVoucherSalesHeader: ' + req.url + ' ...')
  const storeid = req.params.store
  return srvGetVoucherSalesHeader({ ...req.query, storeid }).then(list => {
    res.xstatus(200).json({
      success: true,
      data: list.rows,
      total: list.count
    })
  }).catch(er => next(new ApiError(422, `ZVCS-00002: Couldn't find Voucher`, er)))
}

export function ctlGetVoucherSalesDetail (req, res, next) {
  console.log('Requesting-ctlGetVoucherSalesDetail: ' + req.url + ' ...')
  const storeid = req.params.store
  const transno = req.params.code
  return srvGetDetailSales({ transno, storeid }).then(detail => {
    res.xstatus(200).json({
      success: true,
      data: {
        detail: detail[0],
        payment: detail[1]
      }
    })
  }).catch(er => next(new ApiError(422, `ZVCS-00003: Couldn't find Voucher`, er)))
}

export function ctlCreateVoucher (req, res, next) {
  console.log('Requesting-ctlCreateVoucher: ' + req.url + ' ...')
  const { payment, detailTrans, ...other } = req.body
  const userLogin = req.$userAuth
  return srvGetVoucherList({ voucherno: detailTrans }, 'all').then(async list => {
    let newPayment = []
    const listOption = payment.map(x => x.paymentoption)
    const listPayment = await srvGetSomePaymentOptionByCode(listOption)
    const customer = await srvGetOneCustomerByCode(other.membercode)
    const { id: memberid } = customer || {}
    if(!memberid) throw new Error('Member couldn\'t find')
    if(listPayment.length !== listOption.length) {
      throw new Error('Data doesn\'t match')
    } else {
      listPayment.map(record => {
        const currentPayment = payment.filter(x => x.paymentoption === record.code)[0] || {}
        newPayment.push({
          paymentoptionid: record.id,
          ...currentPayment
        })
      })
      let restrictedVoucher = { status: true, message: '' }
      if(list.length === 0) restrictedVoucher = { status: false, message: `Voucher doesn't exists` }
      for(let rec in list) {
        if(moment(list[rec].expireddate) < moment()){
          restrictedVoucher = { status: false, message: `Voucher ${list[rec].voucherno} has been expired` }
          break
        } else if (list[rec].usedstatus === 'Y') {
          restrictedVoucher = { status: false, message: `Voucher ${list[rec].voucherno} has been used` }
          break
        } else if (list[rec].salesstatus === 'Y') {
          restrictedVoucher = { status: false, message: `Voucher ${list[rec].voucherno} has been saled` }
          break
        }
      }
      
      if(restrictedVoucher.status) {
        return srvInsertVoucherSales({ payment, detail: list, ...other, user: userLogin.userid, memberid }, next).then(created => {
          if(!created.success) {
            throw new Error(created.message)
          } else {
            res.xstatus(200).json({
              success: true,
              data: {},
              message: created.message
            })
          }
        }).catch(er => next(new ApiError(422, `ZVCS-00005: Couldn't create Voucher`, er)))
      } else {
        throw new Error(restrictedVoucher.message)
      }
    }
  }).catch(er => next(new ApiError(422, `ZVCS-00004: Couldn't create Voucher`, er)))
}



