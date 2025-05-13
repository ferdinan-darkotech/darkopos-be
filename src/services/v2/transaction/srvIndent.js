import dbv from '../../../models/viewR'
import db from '../../../models/tableR'
import moment from 'moment'
import cryptojs from 'crypto-js'
import sequelize from '../../../native/sequelize'
import { getNativeQuery } from '../../../native/nativeUtils'
import { setDefaultQuery } from '../../../utils/setQuery'
import { getStoreQuery } from '../../../services/setting/storeService'
import { srvInsertApprovalReturIndent } from '../monitoring/srvApproval'
import { Op } from 'sequelize'


const tbIndent = db.tbl_indent
const tbIndentDetail = db.tbl_indent_detail
const tbIndentCancel = db.tbl_indent_cancel
const tbIndentDetailCancel = db.tbl_indent_detail_cancel
const vwIndent = dbv.vw_indent
const vwIndentDetail = dbv.vw_indent_detail
const vwIndentCancel = dbv.vw_indent_cancel
const vwIndentDetailCancel = dbv.vw_indent_detail_cancel
const vwIndentDetailSales = dbv.vw_indent_detail_sales
const vwIndentSalesReport = dbv.vw_report_indent_sales
const vwIndentDetailSalesReport = dbv.vw_report_indent_detail_sales

const attrIndent = [
	'storeid', 'storecode', 'storename', 'transno', 'transdate', 'reference', 'status', 'duedate',
  'employeecode', 'employeename', 'membercode', 'membername', 'dpcost', 'dpretur', 'dpused',
  'total_orderqty', 'total_returqty', 'total_receiveqty', 'phonenumber', 'mobilenumber',
  'description', 'createdby', 'createdat', 'updatedby', 'updatedat'
]

const attrIndentDetail = {
  mf: [
    'id', 'storeid', 'storecode', 'storename', 'transno', 'transdate', 'duedate',  'productid', 'productcode',
    'productname', ['qty', 'indentqty'], ['currqty', 'qty'], 'price', 'totalprice', 'returqty', 'receiveqty',
    'description', 'createdby', 'createdat', 'updatedby', 'updatedat'
  ],
  bf: [
    'storeid', 'storecode', 'storename', 'transno', 'transdate', 'duedate',  'productcode',
    'productname', ['qty', 'indentqty'], ['currqty', 'qty'], 'returqty', 'price', 'totalprice',
    'receiveqty', 'description'
  ]
}

const attrIndentCancel = [
  'storeid', 'storecode', 'storename', 'cancelno', 'transno',
  'cancelat', 'employeeid', 'employeecode', 'employeename',
  'dpretur', 'description', 
]

const attrIndentDetailCancel = [
  'cancelno', 'productid','productcode',
  'productname', 'returqty', 'cancelby',
  'cancelat'
]

const attrIndentDetailSales = [
  'id', 'transno', 'storeid', 'storecode', 'storename', 'memberid', 'membercode',
  'membername', 'productid', 'productcode', 'productname', 'dpcost',
  'dpretur', 'currdp', 'qty', 'returqty', 'receiveqty', 'currqty'
]

const attrIndentSalesReport = [
  'list_indent_no', 'salesno', 'salesdate', 'memberid', 'membercode', 'membername', 'policenoid', 'policeno',
  'storeid', 'storecode', 'storename', 'total_dpp', 'total_ppn', 'total_netto', 'total_dpused', 'total_paid'
]

const attrIndentSalesDetailReport = [
  'indentno', 'salesno', 'salesdate', 'storeid', 'storecode', 'storename', 'productid', 'productcode', 'productname',
  'qty', 'disc1', 'disc2', 'disc3', 'discount', 'max_disc_nominal', 'max_disc_percent', 'dpp', 'ppn', 'netto'
]

// LOCAL FUNCTION

function insertIndent (data = {}, info = {}, transaction) {
  return tbIndent.create({
    storeid: info.storeid,
	  transno: null,
	  transdate: moment(),
	  reference: data.reference,
	  duedate: data.duedate,
	  employeeid: data.employeeid,
	  memberid: data.memberid,
	  dpcost: data.dpcost,
	  description: data.description,
    taxtype: data.taxtype,
    taxval: data.taxval,
	  createdby: info.user,
	  createdat: info.time,
  }, { transaction, returning: ['*'] })
}

function insertIndentDetail (data = [], info = {}, transaction) {
  const newData = data.map(x => ({
    storeid: info.storeid,
	  transno: info.transno,
	  productid: x.productid,
	  qty: x.qty,
    price: x.price,
	  createdby: info.user,
	  createdat: info.time,
  }))
  return tbIndentDetail.bulkCreate(newData, { transaction })
}


function editIndent (data = {}, info = {}, transaction) {
  return tbIndent.update({
	  reference: data.reference,
	  duedate: data.duedate,
	  dpcost: data.dpcost,
	  description: data.description,
	  updatedby: info.user,
	  updatedat: info.time,
  }, { where: { transno: info.transno, storeid: info.storeid }, returning: ['*'], raw: true }, { transaction })
}


function editIndentDetail (data = [], info = {}, transaction) {
  let bulkUpdated = []
  for (let x in data) {
    const newData = data[x]
    bulkUpdated.push(tbIndentDetail.update({
      qty: newData.qty,
      description: newData.description,
      updatedby: info.user,
      updatedat: info.time
    },
      { where: { transno: info.transno, storeid: info.storeid, productid: newData.productid }, returning: ['*'], raw: true },
      { transaction }
    ))
  }

  return Promise.all(bulkUpdated).then(updated => {
    const newUpdated = updated.map(x => ((x[1] || [])[0] || {}))
    return { status: true, data: newUpdated }
  }).catch(er => ({ status: false, message: er.message, detail: er.detail }))
}

function setReturDP (data = {}, info = {}, transaction = {}) {
  return tbIndent.update({
    dpretur: sequelize.literal(`dpretur + ${data.dpretur}`)
  }, { where: { transno: info.transno, storeid: info.storeid } }, { transaction })
}


function cancelIndentStock (data = [], info = {}, transaction) {
  let bulkCancel = []
  for (let x in data) {
    const newData = data[x]
    bulkCancel.push(tbIndentDetail.update({
      returqty: newData.returqty,
      signal: 'C'
    },
      { where: { id: newData.id }, raw: true },
      { transaction }
    ))
  }

  return Promise.all(bulkCancel).then(canceled => {
    const newCancel = canceled.map(x => ((x[1] || [])[0] || {}))
    return { status: true, data: newCancel }
  }).catch(er => ({ status: false, message: er.message, detail: er.detail }))
}

function receivingIndentStock (data = [], info = {}, transaction) {
  let bulkReceive = []
  for (let x in data) {
    const newData = data[x]
    bulkReceive.push(tbIndentDetail.update({
      receiveqty: newData.receiveqty,
      signal: 'R'
    },
      { where: { transno: info.transno, storeid: info.storeid, productid: newData.productid } },
      { transaction, returning: ['*'] }
    ))
  }

  return Promise.all(bulkReceive).then(receiving => {
    return { status: true, data: receiving }
  }).catch(er => ({ status: false, message: er.message, detail: er.detail }))
}

function insertCancelIndentHistory (data = {}, info = {}, transaction) {
  return tbIndentCancel.create({
    storeid: info.storeid,
	  transno: info.transno,
    description: data.description,
    cancelby: info.user,
	  cancelat: info.time,
	  dpretur: data.dpretur
  }, { transaction, returning: ['*'], raw: true })
}


function insertCancelIndentDetailHistory (data = [], info = {}, transaction) {
  const newData = data.map(x => ({
    cancelno: info.cancelno,
	  referenceid: x.id,
	  productid: x.productid,
	  returqty: x.history_returqty,
	  cancelby: info.user,
	  cancelat: info.time,
  }))
  return tbIndentDetailCancel.bulkCreate(newData, { transaction, returning: ['*'], raw: true })
}




// GLOBAL FUNCTION

export function srvGetIndentByMember ({ membercode }) {
  return vwIndent.findAll({
    attributes: attrIndent,
    where: {
      membercode,
      status: { [Op.or]: [{ [Op.not]: 'D' }, { [Op.not]: 'C' }] },
    },
    raw: true
  })
}

export function srvGetAllIndentDetailByMember ({ membercode }) {
  return vwIndentDetailSales.findAll({
    attributes: attrIndentDetailSales,
    where: { membercode },
    raw: true
  })
}

export function srvGetAllIndentCancelByTrans ({ transno = null, storecode = null }) {
  return vwIndentCancel.findAll({
    attributes: attrIndentCancel,
    where: { transno },
    raw: true
  })
}

export function srvGetAllIndentCancelDetailByTrans ({ cancelno = null }) {
  return vwIndentDetailCancel.findAll({
    attributes: attrIndentDetailCancel,
    where: { cancelno },
    raw: true
  })
}

export function srvGetOneStockIndentCancel (storeid = null, transno = null) {
  return vwIndentCancel.findOne({
    attributes: attrIndentCancel,
    where: { storeid, transno },
    raw: true
  })
}


export function srvGetSomeStockIndent (query = {}) {
  const { store, activeOnly, ...other } = query
  let queryDefault = setDefaultQuery(attrIndent, { ...other }, true)
  const storeFilter = (store || '').toString() === '-1' ? {} : { storeid: store }
  queryDefault.where = {
    ...queryDefault.where,
    ...storeFilter,
    ...((activeOnly || false).toString() === 'true'  ? { status: 'I' } : {})
  }
  return vwIndent.findAndCountAll({
    attributes: attrIndent,
    ...queryDefault,
    raw: true
  })
}

export function srvGetOneStockIndent (storeid = null, transno = null) {
  return vwIndent.findOne({
    attributes: attrIndent,
    where: { storeid, transno },
    raw: true
  })
}


export function srvGetStockIndentDetail (storeid = null, transno = null, mode = 'bf', qtyExists = false) {
  return vwIndentDetail.findAll({
    attributes: attrIndentDetail[mode],
    where: { storeid, transno, ...(qtyExists ? { currqty: { [Op.gt]: 0 } } : {}) },
    raw: true
  })
}

export async function srvCreateIndent (dataHeader, dataDetail, userInfo) {
  const transaction = await sequelize.transaction()
  try {
    let infoData = {
      transno: null,
      storeid: dataHeader.storeid,
      time: moment(),
      user: userInfo.userid
    }
    const createdHeader = await insertIndent(dataHeader, infoData, transaction)
    infoData.transno = createdHeader.transno
    const createdDetail = await insertIndentDetail(dataDetail, infoData, transaction)

    await transaction.commit()
    return { success: true, message: `${infoData.transno} has been created.`, dataHeader: createdHeader }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message, detail: er.detail }   
  }
}

export async function srvUpdateIndent (dataHeader, dataDetail, userInfo) {
  const transaction = await sequelize.transaction()
  try {
    let infoData = {
      transno: dataHeader.transno,
      storeid: dataHeader.storeid,
      time: moment(),
      user: userInfo.userid
    }
    const updatedHeader = await editIndent(dataHeader, infoData, transaction)
    const newHeader = ((updatedHeader[1] || [])[0] || {})
    const updatedDetail = await editIndentDetail(dataDetail, infoData, transaction)

    if(!updatedDetail.status) throw new Error(updatedDetail.message)
    
    await transaction.commit()
    return { success: true, message: `${infoData.transno} has been updated.`, data: { ...newHeader, details: updatedDetail.data  } }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message, detail: er.detail }   
  }
}

export async function srvReceiveStockIndent (data, dataDetail, userInfo) {
  const transaction = await sequelize.transaction()
  try {
    let infoData = {
      transno: data.transno,
      storeid: data.storeid,
      user: userInfo.userid
    }
    const receiveStock = await receivingIndentStock(dataDetail, infoData, transaction)
    
    await transaction.commit()
    return { success: true, message: `Some product of transaction ${infoData.transno} has been received.`, data: receiveStock }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message, detail: er.detail }
  } 
}

export async function srvCancelStockIndent (data, dataDetail, userInfo) {
  const transaction = await sequelize.transaction()
  const appvData = {
    req_memo: data.description,
    ...data
  }
  try {
    let infoData = {
      transno: data.transno,
      storeid: data.storeid,
      user: userInfo.userid,
      time: moment()
    }
    let returnObj = {}

    const dataApproval = await srvInsertApprovalReturIndent({ ...appvData, details: dataDetail, tg_op: 'INSERT' }, infoData.user, infoData.time, transaction)
    if(!dataApproval.success) throw dataApproval.message

    if(dataApproval.success && !dataApproval.active) {
      // const returDP = await setReturDP(data, infoData, transaction)
      // const decreaseStockIndent = await cancelIndentStock(dataDetail, infoData, transaction)
      // if(!decreaseStockIndent.status) throw new Error(decreaseStockIndent.message)
      const insertHistoryIndent = await insertCancelIndentHistory(data, infoData, transaction)
      infoData.cancelno = insertHistoryIndent.cancelno
      const insertHistoryIndentDetail = await insertCancelIndentDetailHistory(dataDetail, infoData, transaction)

      returnObj = { success: true, message: `Some product of transaction ${infoData.transno} has been cancel.`, data: insertHistoryIndent }
    } else {
      returnObj = { success: true, message: 'Transaction need to be approved ...', approval: true, appvno: dataApproval.appvno }
    }
    await transaction.commit()
    return returnObj
  } catch (er) {
    console.log('Retur Indent Error :', er)
    await transaction.rollback()
    return { success: false, message: er.message, detail: er.detail }
  } 
}


export function srvGetReportSalesIndent ({ ho_id, fromDate, toDate }) {
  const newFromDate = moment(fromDate).format('YYYY-MM-DD')
  const newToDate = moment(toDate).format('YYYY-MM-DD')

  const indentSales = `select * from sch_pos.fn_report_indent_sales('${ho_id}', '${newFromDate}', '${newToDate}') value`
  return getNativeQuery(indentSales, false, 'CALL')
}

export function srvGetReportSalesIndentDetail ({ stores = '', fromDate, toDate }) {
  const newFromDate = moment(fromDate).format('YYYY-MM-DD')
  const newToDate = moment(toDate).format('YYYY-MM-DD')

  const indentSalesDetail = `select * from sch_pos.fn_report_detail_indent_sales('${stores.join(',')}', '${newFromDate}', '${newToDate}') value`
  return getNativeQuery(indentSalesDetail, false, 'CALL')
}