// Services Purchase V2

import dbv from '../../../models/view'
import dbvr from '../../../models/viewR'
import db from '../../../models'
import moment from 'moment'
import { setDefaultQuery } from '../../../utils/setQuery'

const Purchase = db.tbl_purchase
const PurchaseView = dbv.vw_purchase
const vwdPurchase = dbvr.vwd_purchase
const purchase = ['id', 'storeId', 'transNo', 'transDate', 'receiveDate', 'supplierId', 'supplierCode',
    'supplierName', 'taxType', 'reference', 'memo',
    'transType', 'discInvoiceNominal', 'discInvoicePercent', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt',
    'printNo', 'tempo', 'dueDate', 'invoiceType', 'taxId', 'rounding', 'taxPercent', 'invoiceDate'
]

const attrPurchaseDetail = {
  mf: [
    'storeid', 'storecode', 'storename', 'supplierid', 'suppliercode', 'suppliername', 'transno', 'transdate', 'receivedate',
    'duedate', 'recapdate', 'taxtype', 'taxpercent', 'productid', 'productcode', 'productname', 'purchaseprice',
    'qty', 'discp1', 'discp2', 'discp3', 'discp4', 'discp5', 'discnominal', 'dpp', 'ppn', 'netto',
    'rounding_dpp', 'rounding_ppn', 'rounding_netto', 'status'
  ],
  bf: [
    'storecode', 'storename', 'suppliercode', 'suppliername', 'transno', 'transdate', 'receivedate',
    'duedate', 'recapdate', 'taxtype', 'taxpercent', 'productcode', 'productname', 'purchaseprice',
    'qty', 'discp1', 'discp2', 'discp3', 'discp4', 'discp5', 'discnominal', 'dpp', 'ppn', 'netto',
    'rounding_dpp', 'rounding_ppn', 'rounding_netto', 'status'
  ],
  lov: [
    'storecode', 'suppliercode', 'transno', 'productcode', 'purchaseprice', 'qty', 'transdate',
    'dpp', 'ppn', 'netto', 'rounding_dpp', 'rounding_ppn', 'rounding_netto',
    'status', 'taxtype', 'taxpercent'
  ]
}

export function srvGetAllPurchaseDetailByCondition (query) {
  const { store, supplier, m, ...other } = query
  const newAttr = attrPurchaseDetail[!!attrPurchaseDetail[m] ? m : 'lov']
  other['productcode@IN'] = other['product']
  delete other['product']
  let queryDefault = setDefaultQuery(newAttr, { ...other }, false)
  queryDefault.where = { ...queryDefault.where, storecode: store, suppliercode: supplier }
  return vwdPurchase.findAll({
    attributes: newAttr,
    ...queryDefault,
    raw: true
  })
}


export function srvGetListPurchaseDetail (query) {
  const { store, supplier, activeOnly = false, m, ...other } = query
  const newAttr = attrPurchaseDetail[!!attrPurchaseDetail[m] ? m : 'lov']

  let queryDefault = setDefaultQuery(newAttr, { ...other }, true)
  const renderStatus = !!activeOnly ? { status: { $eq: true } } : {}
  queryDefault.where = { ...queryDefault.where, storecode: store, ...renderStatus }

  return vwdPurchase.findAndCountAll({
    attributes: newAttr,
    ...queryDefault,
    raw: true
  })
}

export function srvGetListPurchaseDetailBySupplier (query) {
  const { store, supplier, activeOnly = false, m, ...other } = query
  const newAttr = attrPurchaseDetail[!!attrPurchaseDetail[m] ? m : 'lov']

  let queryDefault = setDefaultQuery(newAttr, { ...other }, true)
  const renderStatus = !!activeOnly ? { status: { $eq: true } } : {}
  queryDefault.where = { suppliercode: supplier, storecode: store, ...renderStatus }

  return vwdPurchase.findAndCountAll({
    attributes: newAttr,
    ...queryDefault,
    raw: true
  })
}

export function srvGetTransitData (query) {
  const formatDate = 'YYYY-MM-DD'
  return PurchaseView.findAll({
      attributes: purchase,
      where: {
          storeid: query.store,
          // receivestatus: { $eq: false },
          status: '1',
          receiveDate: { $eq: null },
          invoiceDate: { $lte: moment().format(formatDate) }
      },
      raw: true
  })
}

export function srvReceiveStockPurchase ({ transno, store, receivedate, memo }, userid) {
  return Purchase.update({
      receiveDate: moment(receivedate),
      receiveby: userid,
      memo_receive: memo
  }, { where: { transno, storeid: store, receiveDate: { $eq: null } } })
}