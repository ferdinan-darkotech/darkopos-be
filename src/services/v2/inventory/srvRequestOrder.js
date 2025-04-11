import db from '../../../models/tableR'
import dbv from '../../../models/viewR'
import sequelize from '../../../native/sequelize'
import { setDefaultQuery } from '../../../utils/setQuery'
import moment from 'moment'
import { increaseSequence, getDataByStoreAndCode } from '../../sequencesService'

const Op = require('sequelize').Op
const vwHead = dbv.vw_request_order
const vwDetail = dbv.vw_request_order_detail
const vwCategory = dbv.vw_request_order_category
const tblHead = db.tbl_request_order
const tblDetail = db.tbl_request_order_detail

const tmpAttributes = (attr) => {
  let tmpAttr = [...attr]
  tmpAttr.splice(0, 1)
  return tmpAttr
}
const vwReqHead = [ 'id', 'storeid', 'storename', 'storeidreceiver', 'storenamereceiver', 'transno', 'transdate',
'categorycode', 'categoryname', 'transmemo', 'createdby',
'updatedby', 'createdat', 'updatedat' ]

const vwReqDtl = [ 'id','storeid','storename','storeidreceiver','storenamereceiver','transno','transdate','productid',
'productcode','productname','qty','categorycode','categoryname','transmemo','statuscode','statusname',
'statusby','statusbyname','statusdate','statusremarks' ]

const vwReqCtg = ['categorycode', 'categoryname']


export function srvGetRequestOrderCategory () {
  return vwCategory.findAll({
    attributes: vwReqCtg,
    raw: true
  })
}

export function srvGetRequestOrderHeader (query) {
  const { m, storeid, ...other } = query
  const tmpAttrs = tmpAttributes(vwReqHead)
  let queryDefault = setDefaultQuery(tmpAttrs, other, true)
  queryDefault.where = { ...queryDefault.where, storeid }
  return vwHead.findAndCountAll({
    attributes: tmpAttrs,
    ...queryDefault,
    raw: true
  })
}

export function srvTransExist (transno) {
  return vwHead.findOne({
    attributes: vwReqHead,
    where: { transno }
  }).then(rs => {
    if(rs) return true
    return false
  })
}

export function srvGetRequestOrderDetailByTransNo (storeid, transno, type = 'IN') {
  const where = type === 'IN' ? { storeid, transno } : { storeidreceiver: storeid, transno }
  return vwDetail.findAll({
    attributes: vwReqDtl,
    where,
    raw: true
  })
}

export function srvGetSomeRequestOrderDetail (query, store) {
  const { type, transdate, statusdate, status } = query
  const defaultQuery = { where: { statuscode: { $in: (status || '').split('') } } }
  // const defaultQuery = {}
  const format = 'YYYY-MM-DD'
  let date = {}
  if(transdate) {
    date = { 
      transdate: {
        $between: [moment(transdate).format(format), moment(transdate).endOf('month').format(format)]
      }
    }
  }
  else if(statusdate) {
    date = { 
      transdate: {
        $between: [moment(statusdate).format(format), moment(statusdate).endOf('month').format(format)]
      }
    }
  }
  defaultQuery.where = {
    ...defaultQuery.where,
    [type === 'request' ? 'storeid' : 'storeidreceiver']: store,
    ...date
  }
  return vwDetail.findAll({
    attributes: vwReqDtl,
    ...defaultQuery,
    raw: true
  })
}

async function createHeader (data, transaction) {
  return tblHead.create({
    storeid: data.storeid,
    storeidreceiver: data.storeidreceiver,
    transno: data.transno,
    transdate: data.transdate,
    categorycode: data.categorycode,
    transmemo: data.transmemo,
    // closestatus: 'N',
    createdby: data.user,
    createdat: moment()
  }, { transaction })
}

async function updateHeader (data, transaction) {
  return tblHead.update({
    storeidreceiver: data.storeidreceiver,
    categorycode: data.categorycode,
    transmemo: data.transmemo,
    updatedby: data.user,
    updatedat: moment()
  }, { where: { transno: data.transno } }, { transaction })
}

async function createDetail (data, transaction) {
  const timeCreated = moment()
  let tmpData = []
  for(let i in data) {
    tmpData.push({
      storeid: data[i].storeid,
      transno: data[i].transno,
      productid: data[i].productid,
      productcode: data[i].productcode,
      qty: data[i].qty,
      createdby: data[i].user,
      createdat: timeCreated
    })
  }
  
  return tblDetail.bulkCreate(tmpData, { transaction })
}

async function editDetail (data, transaction) {
  const timeUpdate = moment()
  return data.map(item => {
    tblDetail.update({
      qty: item.qty,
      updatedby: item.user,
      updatedat: timeUpdate
    }, { where: { id: item.id } }, { transaction })
  })
}

async function deleteDetail (data, transaction) {
  const listId = data.map(i => i.id)
  return tblDetail.destroy({ where: { id: { [Op.in]: listId || [] } } }, transaction)
}

export async function srvCreateRequestOrder (data) {
  const { detail = [], ...other } = data
  const transaction = await sequelize.transaction()
  try {
    await createHeader(other, transaction)
    await createDetail(detail, transaction)
    const lastSequence = await getDataByStoreAndCode('RO', other.storeid)
    await increaseSequence('RO', other.storeid, lastSequence.seqValue, transaction)
    await transaction.commit()
    return { success: true }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}

export async function srvUpdateRequestOrder (data) {
  const { detailAdd = [], detailEdit = [], detailDelete = [], ...other } = data
  const transaction = await sequelize.transaction()
  try {
    await updateHeader(other, transaction)
    detailAdd.length > 0 ? await createDetail(detailAdd, transaction) : null
    detailEdit.length > 0 ? await editDetail(detailEdit, transaction) : null
    // detailDelete.length > 0 ? await deleteDetail(detailDelete, transaction) : null
    await transaction.commit()
    return { success: true }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}

export function srvVoidOrder (data) {
  return tblDetail.update({
    statuscode: data.statuscode,
    statusremarks: data.statusremarks,
    statusby: data.statusby,
    statusdate: moment()
  }, { where: { transno: data.transno, productcode: data.productcode } })
}