import dbv from '../../../models/viewR'
import db from '../../../models/tableR'
import moment from 'moment'
import sequelize from '../../../native/sequelize'
import { setDefaultQuery } from '../../../utils/setQuery'
import { increaseSequence, getDataByStoreAndCode } from '../../sequencesService'
import { getSequenceFormatByCode } from '../../sequenceService'

const attrVHeader = [ 'id','storeid','storename','transno','transdate','memberid','membercode','membername',
'cashierid','cashiername','memo','total','paid','change','createdby','createdat','updatedby','updatedat' ]
const attrVList = [ 'id', 'voucherid', 'vouchercode', 'voucherno','vouchernominal','effectivedate','expireddate',
'salesstatus','salesid','memberid','usedstatus','usedid','createdby','createdat','updatedby','updatedat' ]
const attrVDetail = [ 'id','storeid','transno','voucherid','voucherno','vouchernominal','createdby',
'createdat','updatedby','updatedat' ]
const attrVPayment = [ 'id','storeid','transno','paymentoptionid','edcid','cardno','cardname','cardinfo',
'carddescription','memo','printdate','createdby','createdat','updatedby','updatedat' ]
const attrVoucherSalesItem = {
  mf: [ 'storeid', 'memberid', 'transno', 'membercode', 'membername', 'serialcode', 'vouchercode',
  'vouchertype', 'voucherid', 'voucherno', 'vouchernominal', 'itemid','itemcode',
  'itemname', 'active', 'typecode', 'effectivedate', 'expireddate', 'salesstatus', 'usedstatus' ],
  lov: [ 'transno', 'membercode', 'membername', 'serialcode', 'vouchercode', 'vouchertype',
        'voucherno', 'vouchernominal', 'itemcode', 'itemname', 'typecode']
}


const tblVHeader = db.tbl_voucher_sales
const tblVDetail = db.tbl_voucher_sales_detail
const tblVPayment = db.tbl_voucher_sales_payment
const vwVList = dbv.vw_voucher_list
const vwVHeader = dbv.vw_voucher_sales
const vwVDetail = dbv.vw_voucher_sales_detail
const vwVPayment = dbv.vw_voucher_sales_payment
const vwVoucherSalesItem = dbv.vw_voucher_sales_item

const tmpAttributes = (attr) => {
  let tmpAttr = [...attr]
  tmpAttr.splice(0, 1)
  return tmpAttr
}

// Global Function

export function srvGetVoucherSalesByNo (voucherno) {
  return vwVoucherSalesItem.findAll({
    attributes: attrVoucherSalesItem.mf,
    where: { active: true, voucherno },
    raw: true
  })
}

export function srvGetVoucherSalesItem (query, modeFetch = 'count', extraFilter) {
  const { item, membercode, type, status, mode, vld, ...other } = query
  const statusActive = status ? { active: status } : {}
  const typeCode = type ? { typeCode: type.split(',') } : {}
  const newAttr = mode === 'lov' ? attrVoucherSalesItem.lov : attrVoucherSalesItem.mf
  const searchByItem = item ? {itemcode: { $in: item.split(',') } } : {}
  if(modeFetch === 'count') {
    return vwVoucherSalesItem.findAll({
      attributes: newAttr,
      where: { ...typeCode, ...statusActive, membercode, ...searchByItem },
      raw: true
    })
  } else if (modeFetch === 'params') {
    let extendsFilter = {}
    let defaultextendFilter = { salesstatus: { $ne: 'N' }, usedstatus: { $ne: 'N' } }
    if(vld.indexOf('XP') !== -1) extendsFilter = { expireddate: { $gt: moment().format('YYYY-MM-DD') } }
    if(vld.indexOf('SS') !== -1) extendsFilter = { ...extendsFilter, salesstatus: { $ne: 'Y' } }
    if(vld.indexOf('US') !== -1) extendsFilter = { ...extendsFilter, usedstatus: { $ne: 'Y' } }
    return vwVoucherSalesItem.findAll({
      attributes: attrVoucherSalesItem.mf,
      where: { vouchercode: { $in: other.vouchercode }, ...defaultextendFilter, ...extraFilter, ...extendsFilter },
      raw: true
    })
  }
}

export function srvGetVoucherList (query, mode = 'count', extraFilter) {
  const { type = '', voucherlist,  total, ...other } = query
  let extendsFilter = {}
  let extraFilter2 = {}
  let defaultextendFilter = { salesstatus: { $ne: 'N' }, usedstatus: { $ne: 'N' } }
  if(type.indexOf('XP') !== -1) extendsFilter = { expireddate: { $gt: moment().format('YYYY-MM-DD') } }
  if(type.indexOf('SS') !== -1) extendsFilter = { ...extendsFilter, salesstatus: { $ne: 'Y' } }
  if(type.indexOf('US') !== -1) extendsFilter = { ...extendsFilter, usedstatus: { $ne: 'Y' } }
  if(extraFilter2) extraFilter2 = { vouchercode: { $in: voucherlist }, ...defaultextendFilter, ...extraFilter, ...extendsFilter }
  
  let tmpAttrs = tmpAttributes(attrVList)
  let queryDefault = setDefaultQuery(tmpAttrs, other, true)

  queryDefault.where = {
    ...extraFilter2,
    ...queryDefault.where
  }
  if(mode === 'count') {
    // queryDefault.where = { ...queryDefault.where, ...defaultextendFilter, ...extendsFilter }
    return vwVList.findAndCountAll({
      attributes: tmpAttrs,
      ...queryDefault,
      raw: true
    })
  } else if (mode === 'params') {
    return vwVList.findAll({
      attributes: tmpAttrs,
      ...queryDefault,
      raw: true
    })
  } else {
    return vwVList.findAll({
      attributes: attrVList,
      where: { voucherno: { $in: other.voucherno } },
      raw: true
    })
  }
}

export function srvGetVoucherSalesHeader (query) {
  const { storeid, ...other } = query
  let tmpAttrs = tmpAttributes(attrVHeader) 
  let queryDefault = setDefaultQuery(tmpAttrs, { ...other }, true)
  queryDefault.where = { ...queryDefault.where, storeid }
  return vwVHeader.findAndCountAll({
    attributes: tmpAttrs,
    ...queryDefault,
    raw: true
  })
}

export function srvGetOneVoucherSalesHeader (transno, storeid) {
  return vwVHeader.findOne({
    attributes: attrVHeader,
    where: { transno, storeid }, 
    raw: true
  })
}

export default function srvGetDetailSales (transno, storeid) {
  const detail = srvGetOneVoucherSalesDetail(transno, storeid)
  const payment = srvGetOneVoucherSalesPayment(transno, storeid)

  return Promise.all([detail,payment]).then(rs => {
    return rs
  }).then(er => {
    return er
  })
}

export async function srvInsertVoucherSales (data, next) {
  const transaction = await sequelize.transaction()
  try {
    const { payment, detail, ...other } = data
    const transno = await getSequenceFormatByCode({ seqCode: 'VCSALES', type: other.storeid }, next)
    const info = { user: other.user, times: moment(), transno, storeid: other.storeid }
    const crtHeader = await srvCreateSalesHeader(other, info, transaction)
    const crtDetail = await srvCreateSalesDetail(detail, info, transaction)
    const crtPayment = await srvCreateSalesPayment(payment, info, transaction)
    const lastSequence = await getDataByStoreAndCode('VCSALES', other.storeid)
    await increaseSequence('VCSALES', other.storeid, lastSequence.seqValue, transaction)

    await transaction.commit()
    return { success: true, message: `Transaction ${transno} has been saved` }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}


// Local Function

function srvGetOneVoucherSalesDetail (transno, storeid) {
  return vwVDetail.findAll({
    attributes: attrVDetail,
    where: { transno, storeid },
    raw: true
  })
}

function srvGetOneVoucherSalesPayment (transno, storeid) {
  return vwVPayment.findAll({
    attributes: attrVPayment,
    where: { transno, storeid },
    raw: true
  })
}

function srvCreateSalesHeader (data, info, transaction) {
  return tblVHeader.create({
    storeid: info.storeid,
    transno: info.transno,
    packagecode: data.packagecode,
    transdate: data.transdate,
    memberid: data.memberid,
    cashierid: data.cashierid,
    memo: data.memo,
    total: data.total,
    change: data.change,
    paid: data.paid,
    createdby: info.user,
    createdat: info.times
  }, { transaction })
}

function srvCreateSalesDetail (data, info, transaction) {
  const newData = data.map(x => ({
    storeid: info.storeid,
    transno: info.transno,
    voucherid: x.voucherid,
    voucherno: x.voucherno,
    vouchernominal: x.vouchernominal,
    createdby: info.user,
    createdat: info.times
  }))
  return tblVDetail.bulkCreate(newData, { transaction })
}

function srvCreateSalesPayment (data, info, transaction) {
  const newData = data.map(x => ({
    storeid: info.storeid,
    transno: info.transno,
    paymentoptionid: x.paymentoptionid,
    edcid: x.edcid,
    cardno: x.cardno || '',
    cardname: x.cardname,
    cardinfo: x.cardinfo,
    carddescription: x.carddescription,
    amount: x.amount,
    memo: x.memo,
    printdate: x.printdate,
    createdby: info.user,
    createdat: info.times
  }))
  return tblVPayment.bulkCreate(newData, { transaction })
}
