import vw from '../../../models/viewR'
import dbv from "../../../models/view"
import tbl from '../../../models/tableR'
import moment from 'moment'
import { getNativeQuery } from '../../../native/nativeUtils'
import { srvGetGroupStoreBranchByID } from '../../v2/master/store/srvStore.js'
import { getMiscByCodeName } from '../../../services/v1/miscService'
import { getSettingByCodeV2 } from '../../../services/settingService'
import cryptojs, { format } from 'crypto-js'
import customeSequelize from '../../../native/sequelize'
import sequelize, { Op } from 'sequelize'

const formatDate = 'YYYY-MM-DD'
const formatDateTime = 'YYYY-MM-DD HH:mm:ss'

const settingApproval = tbl.tbl_setting_approval
const approval = tbl.tbl_approval
const approvalAdjustDetail = tbl.tbl_tmp_adjust_detail
const approvalPurchaseDetail = tbl.tbl_tmp_purchase_detail
const approvalIndentDetail = tbl.tbl_tmp_indent_detail
const approvalTransferOutDetail = tbl.tbl_tmp_transfer_out_detail

const approvalLists = vw.vw_approval_list
const approvalSign = vw.vw_approval_sign
const approvalOpts = vw.vw_approval_options
const vwApprovalSP = vw.vw_approval_stock_price
const vwApprovalCust = vw.vw_approval_customer_data

const vwApprovalAdjust = vw.vw_approval_adjustment
const vwApprovalAdjustGroups = vw.vw_approval_adjustment_groups

const vwApprovalPurchase = vw.vw_approval_purchase
const vwApprovalPurchaseGroups = vw.vw_approval_purchase_groups

const vwApprovalVoidSales = vw.vw_approval_void_sales_trans

const vwApprovalReturIndent = vw.vw_approval_retur_indent
const vwApprovalReturIndentGroups = vw.vw_approval_retur_indent_groups

const vwApprovalReturTransferOut = vw.vw_approval_transfer_out
const vwApprovalReturTransferOutGroups = vw.vw_approval_transfer_out_groups

// [NEW]: FERDINAN - 2025-04-08
const vwRequestStockOut = dbv.vw_request_stock_out;


const settingApprovalAttribute = [
  'appv_code', 'appv_name', 'appv_desc', 'appv_users', 'appv_status'
]
const tblAttribute = [
  'appvid', 'appvtype', 'appvname', 'appvpayload',
  'reqat', 'reqby', 'reqmemo', 'trigger_op', 'appvstatus'
]
const attrStockPrice = [
  'appvid','productid','productcode','productname','storecode', 'storename','new_costprice','new_sellprice','new_sellpricepre',
  'new_distprice01','new_distprice02','old_costprice','old_sellprice','old_sellpricepre','old_distprice01',
  'old_distprice02','reqat','reqby','reqmemo','appvstatus','appvby','appvat','appvmemo', 'appvno', 'specuser'
]
const attrCustData = [
  'appvid', 'membercode', 'membername', 'membergroupid', 'membertypeid', 'membercategoryid', 'membergroupcode', 'membergroupname', 'membertypecode',
  'membertypename', 'membercategorycode', 'membercategoryname', 'idtype', 'idno', 'address01', 'address02', 'cityid', 'state', 'zipcode',
  'phonenumber', 'mobilenumber', 'email', 'birthdate', 'gender', 'taxid', 'cashback', 'validitydate', 'mobileactivate', 'oldmembercode',
  'reqat', 'reqby', 'reqmemo', 'appvstatus', 'appvby', 'appvat', 'appvmemo', 'appvno', 'specuser'
]
const attrAdjustment = [
  'appvid', 'storeid', 'storecode', 'storename', 'transno', 'transdate', 'reference', 'referencedate', 'transtype', 'picid', 'pic', 'supplierid',
  'suppliercode', 'suppliername', 'totalprice', 'returnstatuscode', 'returnstatusname', 'trigger_op', 'appvrules', 'data_detail', 'reqat',
  'reqby', 'reqmemo', 'appvstatus', 'appvby', 'appvat', 'appvmemo', 'appvno', 'specuser'
]

const attrPurchase = [
  'appvid', 'appvgroupid', 'storeid', 'storecode', 'storename', 'transno', 'reference', 'taxtype', 'taxpercent', 'transdate', 'invoicedate', 'duedate',
  'supplierid', 'suppliercode', 'suppliername', 'invoicetype', 'totalprice', 'totaldisc', 'totaldpp', 'totalppn', 'totalnetto', 'memo', 'reqat',
  'reqby', 'reqmemo', 'appvtype', 'trigger_op', 'data_detail', 'appvby', 'appvat', 'appvstatus', 'appvmemo', 'appvlvl', 'appvrules', 'appvno', 'specuser'
]


const attrVoidSales =  [
  'appvid', 'storeid', 'storecode', 'storename', 'transno', 'transdate', 'employeecode', 'employeename', 'membercode',
  'membername', 'policeno', 'wono', 'total_netto', 'total_dpp', 'total_ppn', 'appvgroupid', 'appvtype', 'appvname',
  'reqmemo', 'reqby', 'reqat', 'appvno', 'specuser'
]

const attrReturIndent = [
  'appvid', 'indentno', 'storeid', 'storecode', 'storename', 'memberid', 'membercode',
  'membername', 'dpretur', 'trigger_op', 'appvrules', 'data_detail', 'reqat',
  'reqby', 'reqmemo', 'appvstatus', 'appvby', 'appvat', 'appvmemo', 'appvno', 'specuser'
]


const attrTransferOut = [
  'appvid', 'appvgroupid', 'storeid', 'storecode', 'storename', 'storecodereceiver',
  'storenamereceiver', 'transno', 'transtype', 'reference', 'referencedate', 'transdate',
  'description', 'employeeid', 'employeecode', 'employeename', 'carnumber', 'reqat',
  'reqby', 'reqmemo', 'appvtype', 'trigger_op', 'data_detail', 'appvby', 'appvat',
  'appvstatus', 'appvmemo', 'appvlvl', 'appvrules', 'appvno', 'specuser'
]

const attrReturIndentG = [
  'appvid', 'indentno', 'storeid', 'storecode', 'storename', 'memberid',
  'membercode', 'membername', 'dpretur', 'trigger_op', 'appvrules',
  'data_detail', 'reqat', 'reqby', 'reqmemo', 'appvno'
]

const attrTransferOutG = [
  'appvid', 'storeid', 'storecode', 'storename', 'storecodereceiver', 'storenamereceiver', 'transno',
  'transtype', 'reference', 'referencedate', 'transdate', 'description', 'employeeid', 'employeecode',
  'employeename', 'carnumber', 'reqat', 'reqby', 'reqmemo', 'appvtype', 'trigger_op', 'data_detail',
  'appvsign', 'appvno'
]

const attrPurchaseG = [
  'appvid', 'appvgroupid', 'storeid', 'storecode', 'storename', 'transno', 'reference', 'taxtype', 'taxpercent', 'transdate', 'invoicedate',
  'duedate', 'supplierid', 'suppliercode', 'suppliername', 'invoicetype', 'totalprice', 'totaldisc', 'totaldpp', 'totalppn', 'totalnetto',
  'memo', 'reqat', 'reqby', 'reqmemo', 'appvtype', 'trigger_op', 'data_detail', 'appvsign', 'appvno'
]

const attrAdjustmentG = [
  'appvid', 'storeid', 'storecode', 'storename', 'transno', 'transdate', 'reference', 'referencedate', 'transtype', 'picid', 'pic', 'supplierid',
  'suppliercode', 'suppliername', 'totalprice', 'returnstatuscode', 'returnstatusname', 'trigger_op', 'data_detail', 'reqat', 'reqby', 'reqmemo',
  'appvsign', 'appvno'
]

// [NEW]: FERDINAN - 2025-04-09
const attrRequestStockOut = [
  'transactionnumber', 'queuenumber', 'storename', 'reqby', 'reqat', 'memocancel', 'appvid', 'appvno', 'appvstatus', 'appvgroupid', 'appvlvl', 'statusapproval', 'data_detail'
]

// Local Function

async function approvalPack (options, type, storeCurrent) {
  let data = []
  try {
    const groups = await srvGetGroupStoreBranchByID(storeCurrent, type === 'STOCKPRICE')
    const filterSiblings = { storeid: { [Op.in]: groups.siblings.split(',') } }

    if(type === 'STOCKPRICE') {
      if(!groups.parentSetting) throw new Error('Setting parent is not found.')
      const localPrice = (((groups.parentSetting.inventory || {}).separate || {}).price || false)
      data = [vwApprovalSP, attrStockPrice, (localPrice ? filterSiblings : { storeid: { [Op.eq]: null } })]
    } else if (type === 'CUSTDATA') {
      data = [vwApprovalCust, attrCustData, { ...filterSiblings }]
    } else if (type === 'ADJUSTMENT') {
      data = [vwApprovalAdjust, attrAdjustment, { ...filterSiblings }]
    } else if (type === 'PURCHASE') {
      data = [vwApprovalPurchase, attrPurchase, { ...filterSiblings }]
    } else if (type === 'VOID-FJ') {
      data = [vwApprovalVoidSales, attrVoidSales, { ...filterSiblings }]
    } else if (type === 'INDENT') {
      data = [vwApprovalReturIndent, attrReturIndent, { ...filterSiblings }]
    } else if (type === 'MUOUT') {
      data = [vwApprovalReturTransferOut, attrTransferOut, { ...filterSiblings }]
    } else if (type === 'STOCKOUT') {
      data = [vwRequestStockOut, attrRequestStockOut, { ...filterSiblings }]
    }
    return data
  } catch (er) {
    throw new Error(er.message)
  }
}


// Global Function
export function srvGetListApproval () {
  return approvalLists.findAll({
    attributes: ['*'],
    raw: true
  })
}


export function srvFindOneApprovalReturIndent (otherFilter = {}) {
  return vwApprovalReturIndent.findOne({
    attributes: [...attrReturIndent, 'appvstatus'],
    where: { ...otherFilter },
    raw: true
  })
}


export function srvFindOneApprovalVoidSales (otherFilter = {}) {
  return vwApprovalVoidSales.findOne({
    attributes: [...attrVoidSales, 'appvstatus'],
    where: { ...otherFilter },
    raw: true
  })
}


export function srvFindOneApprovalAdjustment (appvid, otherFilter = {}) {
  return vwApprovalAdjustGroups.findOne({
    attributes: [...attrAdjustmentG, 'appvstatus', 'appvpayload'],
    where: { appvid, ...otherFilter },
    raw: true
  })
}

export function srvFindOneApprovalPurchase (appvid, otherFilter = {}) {
  return vwApprovalPurchaseGroups.findOne({
    attributes: [...attrPurchaseG, 'appvstatus', 'appvpayload'],
    where: { appvid, ...otherFilter },
    raw: true
  })
}

export function srvFindDataByPayloadType (approvaltype, keys, values, status = ['A', 'P', 'R']) {
  return approvalSign.findOne({
    attributes: tblAttribute,
    where: { appvtype: approvaltype, appvstatus: { [Op.in]: status }, '': sequelize.literal(`(appvpayload ->> '${keys}')::text = '${values}'::text`) },
    raw: true
  })
}

function approvalGroupPack (options, type) {
  let data = []
  if(type === 'PURCHASE') {
    data = [vwApprovalPurchaseGroups, attrPurchaseG, {}]
  } else if (type === 'ADJUSTMENT') {
    data = [vwApprovalAdjustGroups, attrAdjustmentG, {}]
  } else if (type === 'INDENT') {
    data = [vwApprovalReturIndentGroups, attrReturIndentG, {}]
  } else if (type === 'MUOUT') {
    data = [vwApprovalReturTransferOutGroups, attrTransferOutG, {}]
  }
  return data
}



export function srvGetApprovalOptions (query) {
  const { by, code } = query
  if (!code && !by) {
    return approvalOpts.findAll({
      attributes: [['appvcode', 'key'], ['appvname','label']],
      group: ['appvcode', 'appvname'],
      raw: true
    })
  } else if(by) {
    return approvalOpts.findOne({
      attributes: ['reqat'],
      where: { key: by, appvcode: code, appvlvl: query.lvl },
      raw: true
    }).then(rs => {
      return (rs || {}).reqat || []
    }).catch(er => er)
  } else {
    return approvalOpts.findAll({
      attributes: ['key', 'label'],
      where: { appvcode: code, appvlvl: query.lvl },
      raw: true
    })
  }
}

export function srvGetApprovalProgress (query) {
  const { type, store, options, page = 1, pageSize = 20 } = query
  let extendFilter = {}
  let attribute = []
  let objectView =  {}
  
  return new Promise(async (resolve, reject) => {
    const typeExists = JSON.parse(JSON.stringify(await getMiscByCodeName('APPVSTM', type)))
    const miscName = (typeExists || {}).miscName
  
    if (miscName) {
      [objectView, attribute, extendFilter] = approvalGroupPack(options, miscName)
    } else {
      return reject({ success: false, message: 'Type approval is not define' })
    }
    const extraFilter = {
      storeid: store,
      '': sequelize.literal(`appvstatus not similar to '%(R)%'`),
      '': sequelize.literal(`appvstatus similar to '%(P)%'`)
      
    }
    return objectView.findAndCountAll({
      attributes: attribute,
      where: { ...extendFilter, ...extraFilter },
      limit: +pageSize,
      offset: (+page - 1) * +pageSize,
      raw: false
    }).then(rs => {
      return resolve({ success: true, data: rs })
    }).catch(er => reject({ success: false, message: er.message }))
  })
}

export async function srvGetApproval (query, storeCurrent) {
  try {
    const { type, status = '', options, page = 1, pageSize = 1000, at, by } = query
    let extendFilter = {}
    let attribute = []
    let objectView =  {}
    let stat = status.split(',')
    
    const typeExists = JSON.parse(JSON.stringify(await getMiscByCodeName('APPVSTM', type)))
    const miscName = (typeExists || {}).miscName
    if(stat.indexOf('R') === -1 && stat.indexOf('A') === -1 && stat.indexOf('P') === -1) {
      return reject({ success: false, message: 'Status approval is not define' })
    }

    if(stat.indexOf('P') !== -1 && (stat.indexOf('A') !== -1 || stat.indexOf('R') !== -1)) {
      return reject({ success: false, message: 'Couldn\'t combine pending status with other' })
    }

    if (miscName) {
      [objectView, attribute, extendFilter] = await approvalPack(options, miscName, storeCurrent)
    } else {
      return reject({ success: false, message: 'Type approval is not define' })
    }
    const extraFilter = {
      ...(by ? { reqby: by } : {}),
      ...(at ? { appvgroupid: at.split(',') } : {}),
      appvlvl: query.lvl
    }
    const datas = await objectView.findAndCountAll({
      attributes: attribute,
      where: { appvstatus: { [Op.in]: stat }, ...extendFilter, ...extraFilter },
      limit: +pageSize,
      offset: (+page - 1) * +pageSize,
      raw: true
    })
    // if(datas.count === 0) throw new Error('Empty data, make sure your current store upon approval request.')
    return datas
  } catch (er) {
    throw new Error(er.message)
  }
}

export async function srvUpdateApproval (data, user) {
  return new Promise(async (resolve, reject) => {
    const { updateType, appvtype, reqby, advFilter, storeid, ...toUpdated } = data
    const { appvstatus, appvmemo, appvrole, appvlvl } = toUpdated
    let newPayload = {}

    if(appvstatus !== 'R' && appvstatus !== 'A') {
      return reject({ success: false, message: 'Status approval is not allowed' })
    }

    if(typeof storeid !== 'number' && storeid <= 0) {
      return reject({ success: false, message: 'Store id undefined' })
    }

    if(updateType === 'MANUAL') {
      newPayload = advFilter
    } else if(updateType === 'FILTER') {
      newPayload = { appvtype, reqby, groupid: advFilter }
    }

    const sSql = `select * from fn_bulk_update_system_approval('${appvstatus}', '${user}', '${appvmemo}', '${appvrole}', '${appvlvl}', '${JSON.stringify(newPayload)}', '${updateType}', ${storeid})`
    return getNativeQuery(sSql,false, 'RAW').then(rs => {
      return resolve({ success: true, data: JSON.parse(JSON.stringify(rs))[0][0].fn_bulk_update_system_approval })
    }).catch(er => reject({ success: false, message: er.message }))
  })
}

function insertApprovalHeader (group_pref, data, user, current_time, transaction) {
  const groupid = `APPVG-${group_pref}-${moment(current_time).format('YYYY-MM-DD hh:mm:ss')}-${user}`
  return approval.create({
    appvtype: data.appvtype,
    appvgroupid: cryptojs.MD5(groupid).toString(),
    appvname: 'NO-NAME',
    appvpayload: data.appvpayload,
    storeid: data.storeid,
    reqby: user,
    reqat: current_time,
    reqmemo: data.reqmemo,
    trigger_op: data.trigger_op
  }, { transaction, returning: ['*'] })
}

function updateApprovalHeader (data, user, current_time, transaction) {
  return approval.update({
    appvpayload: data.appvpayload,
    reqby: user,
    reqat: current_time,
    reqmemo: data.reqmemo
  }, { where: { appvid: data.appvid } }, { transaction })
}

function getSettingApprovalOf (storeid, code) {
  return settingApproval.findOne({
    attributes: settingApprovalAttribute,
    where: {
      store_id: storeid,
      appv_code: code
    },
    raw: true
  }).then(async data => {
    const dataSettingRoles = await getSettingByCodeV2('SETTAPPV')
    const newSetting = ((JSON.parse(JSON.stringify(dataSettingRoles)) || {}).settingvalue || {})
    if(!(data || {}).appv_status) {
      return { status: false, code: 'ST02', message: 'Approval is non-active' }
    } else if (newSetting.RULES) {
       return { status: false, code: 'ST01', message: 'No Roles Specified' }
    }
    return { status: true }
  }).catch(er => ({ status: false, message: er.message, code: 'ST01' }))
}

export async function srvInsertApprovalAdjustment (data, detail, user, current_time, transaction) {
  const typeApproval = 'ADJUSTMENT'
  try {
    const settAppv = await getSettingApprovalOf(data.storeId, typeApproval)
    if(!settAppv.status) {
      if(settAppv.code === 'ST02') return { success: true, active: false }
      else throw er.message
    }
    const headerPayload = {
      transno: data.transNo,
			storeid: data.storeId,
			transtype: data.transType,
			transdate: moment(data.transDate || current_time).format(formatDate),
			picid: data.picId,
			pic: data.pic,
			reference: data.reference,
			memo: data.memo,
			createdby: user,
			createdat: current_time,
			supplierid: data.supplierid,
			totalprice: data.totalPrice,
      totaldiscount: data.totaldiscount,
      totaldpp: data.totaldpp,
      totalppn: data.totalppn,
      totalnetto: data.totalnetto,
      totalrounding: data.totalrounding,
			returnstatus:  data.returnstatus,
			referencedate: moment(data.referencedate).format(formatDate)
    }
    const headerCreated = await insertApprovalHeader(
      typeApproval,
      {
        appvname: `[${data.tg_op === 'UPDATE' ? 'EDIT' : 'ADD'}] Adjustment Stock`,
        appvtype: typeApproval,
        appvpayload: headerPayload,
        storeid: data.storeId,
        trigger_op: data.tg_op 
      }, user, current_time, transaction
    )
    let recreateDetail = (detail || []).map(x => ({
      appvid: headerCreated.appvid,
      storeid: x.storeId,
      transno: data.transNo,
      productid: x.productId,
      adjinqty: x.adjInQty,
      adjoutqty: x.adjOutQty,
      sellingprice: x.sellingPrice,
      closed: x.closed,
      recapdate: x.recapDate,
      refno: x.refno,
	    taxtype: x.taxtype,
	    taxval: x.taxval,
	    discp01: x.discp01,
	    discp02: x.discp02,
	    discp03: x.discp03,
	    discp04: x.discp04,
	    discp05: x.discp05,
	    discnominal: x.discnominal,
	    dpp: x.dpp,
	    ppn: x.ppn,
	    netto: x.netto,
	    rounding_netto: x.rounding_netto,
      createdby: user,
      updatedby: user,
      createdat: current_time,
      updatedat: current_time
    }))
    await approvalAdjustDetail.bulkCreate(recreateDetail, { transaction })
    return { success: true, message: 'Need to be approved', active: true, appvno: JSON.parse(JSON.stringify(headerCreated)).appvno }
  } catch (er) {
    return { success: false, message: er.message }
  }
}

export async function srvEditApprovalAdjustment (current, data, detail, user) {
  const current_time = moment()
  const transaction = await customeSequelize.transaction()
  try {
    const headerPayload = {
      ...current,
      transno: current.transno,
			storeid: current.storeid,
			transtype: data.transType,
			transdate: current.transdate,
			picid: data.picId,
			pic: data.pic,
			reference: current.reference,
			memo: data.memo,
			createdby: user,
			createdat: current_time,
			supplierid: data.supplierid,
			totalprice: data.totalPrice,
      totaldiscount: data.totaldiscount,
      totaldpp: data.totaldpp,
      totalppn: data.totalppn,
      totalnetto: data.totalnetto,
      totalrounding: data.totalrounding,
			returnstatus:  data.returnstatus,
			referencedate: moment(data.referencedate).format(formatDate)
    }
    await updateApprovalHeader({ appvid: data.appvid, appvpayload: headerPayload }, user, current_time, transaction)

    const newDetail = (detail || [])
    const afterUpdated = []
    const undeletedRecord = []
    for(let x in newDetail) {
      undeletedRecord.push(newDetail[x].productId)
      const tmpData = {
        adjinqty: newDetail[x].adjInQty,
        adjoutqty: newDetail[x].adjOutQty,
        sellingprice: newDetail[x].sellingPrice,
        taxtype: newDetail[x].taxtype,
        taxval: newDetail[x].taxval,
        discp01: newDetail[x].discp01,
        discp02: newDetail[x].discp02,
        discp03: newDetail[x].discp03,
        discp04: newDetail[x].discp04,
        discp05: newDetail[x].discp05,
        discnominal: newDetail[x].discnominal,
        dpp: newDetail[x].dpp,
        ppn: newDetail[x].ppn,
        netto: newDetail[x].netto,
        rounding_netto: newDetail[x].rounding_netto,
        updatedby: user,
        updatedat: current_time
      }
      const tmpDataCreated = {
        appvid: data.appvid,
        transno: current.transno,
        storeid: current.storeid, 
        productid: newDetail[x].productId,
        adjinqty: newDetail[x].adjInQty,
        adjoutqty: newDetail[x].adjOutQty,
        sellingprice: newDetail[x].sellingPrice,
        closed: newDetail[x].closed,
        recapdate: newDetail[x].recapDate,
        refno: newDetail[x].refno,
        taxtype: newDetail[x].taxtype,
        taxval: newDetail[x].taxval,
        discp01: newDetail[x].discp01,
        discp02: newDetail[x].discp02,
        discp03: newDetail[x].discp03,
        discp04: newDetail[x].discp04,
        discp05: newDetail[x].discp05,
        discnominal: newDetail[x].discnominal,
        dpp: newDetail[x].dpp,
        ppn: newDetail[x].ppn,
        netto: newDetail[x].netto,
        rounding: newDetail[x].rounding,
        createdby: user,
        createdat: current_time
      }
      const retDetail = await approvalAdjustDetail.update(tmpData, { where: { appvid: data.appvid, productid: newDetail[x].productId } }, { transaction })
      if(retDetail[0] === 0) {
        afterUpdated.push(tmpDataCreated)
      }
    }

    await approvalAdjustDetail.bulkCreate(afterUpdated, { transaction })
    await approvalAdjustDetail.destroy({ where: { appvid: data.appvid, productid: { [Op.notIn]: undeletedRecord } } }, { transaction })
    await transaction.commit()
    return { success: true }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}



export async function srvInsertApprovalPurchase (data, detail = {}, user, current_time, transaction) {
  const typeApproval = 'PURCHASE'

  try {
    const settAppv = await getSettingApprovalOf(data.storeId, typeApproval)
    if(!settAppv.status) {
      if(settAppv.code === 'ST02') return { success: true, active: false }
      else throw er.message
    }
    
    const headerPayload = {
      transno: data.transNo || null,
      storeid: data.storeId,
      transdate: moment(data.transDate || current_time).format(formatDate),
      receivedate: data.receiveDate,
      supplierid: data.supplierCode,
      taxtype: data.taxType,
      taxpercent: data.taxPercent,
      reference: data.reference,
      memo: data.memo,
      invoicedate: moment(data.invoiceDate || current_time).format(formatDate),
      duedate: moment(data.dueDate || moment(current_time).add(1, 'day')).format(formatDate),
      invoicetype: data.invoiceType,
      taxid: data.taxId,
      discinvoicenominal: (data.discInvoiceNominal || 0),
      discinvoicepercent: (data.discInvoicePercent || 0),
      createdby: user,
      createdat: current_time,
      updatedby: user,
      updatedat: current_time,
      totalprice: (data.invoiceTotal || 0),
      totaldisc: (data.discTotal || 0),
      totaldpp: (data.totalDPP || 0),
      totalppn: (data.totalPPN || 0),
      totalnetto: (data.nettoTotal || 0),
      memo: data.memo || '',
      transtype: data.transType || ''
    }
    const headerCreated = await insertApprovalHeader(
      typeApproval,
      {
        appvname: `[${data.tg_op === 'UPDATE' ? 'EDIT' : 'ADD'}] Purchase`,
        appvtype: typeApproval,
        appvpayload: headerPayload,
        storeid: data.storeId,
        trigger_op: data.tg_op 
      }, user, current_time, transaction
    )
    let recreateDetail = []
    const detailAdd = (detail.add || [])
    const detailEdit = (detail.edit || [])
    const detailVoid = (detail.void || [])
    for (let item in detailAdd) {
      const x = detailAdd[item]
      recreateDetail.push({
        appvid: headerCreated.appvid,
        storeid: x.storeId,
        transno: data.transNo,
        productid: x.productId,
        qty: x.qty,
        purchaseprice: +(x.purchasePrice || 0),
        sellingprice: +(x.sellingPrice || 0),
        discp1: +(x.discp1 || 0),
        discp2: +(x.discp2 || 0),
        discp3: +(x.discp3 || 0),
        discp4: +(x.discp4 || 0),
        discp5: +(x.discp5 || 0),
        discnominal: +(x.discNominal || 0),
        dpp: +(x.DPP || 0) + x.rounding_dpp,
        ppn: +(x.PPN || 0) + x.rounding_ppn,
        void: +(x.void || false),
        rounding_netto: (x.rounding_netto || 0),
        rounding_ppn: (x.rounding_ppn || 0),
        rounding_dpp: (x.rounding_dpp || 0),
        createdby: user,
        updatedby: user,
        createdat: current_time,
        updatedat: current_time,
        action_type: 'ADD'
      })
    }
    
    for (let item in detailEdit) {
      const x = detailEdit[item]
      recreateDetail.push({
        appvid: headerCreated.appvid,
        storeid: x.storeId,
        transno: data.transNo,
        productid: x.productId,
        qty: x.qty,
        purchaseprice: +(x.purchasePrice || 0),
        sellingprice: +(x.sellingPrice || 0),
        discp1: +(x.discp1 || 0),
        discp2: +(x.discp2 || 0),
        discp3: +(x.discp3 || 0),
        discp4: +(x.discp4 || 0),
        discp5: +(x.discp5 || 0),
        discnominal: +(x.discNominal || 0),
        dpp: +(x.DPP || 0),
        ppn: +(x.PPN || 0),
        void: +(x.void || false),
        rounding_netto: (x.rounding_netto || 0),
        rounding_ppn: (x.rounding_ppn || 0),
        rounding_dpp: (x.rounding_dpp || 0),
        createdby: user,
        updatedby: user,
        createdat: current_time,
        updatedat: current_time,
        action_type: 'EDIT'
      })
    }
    
    // for (let item in detailVoid) {
    //   const x = detailVoid[item]
    //   recreateDetail.push({
    //     appvid: headerCreated.appvid,
    //     storeid: x.storeId,
    //     transno: x.transNo,
    //     productid: x.productId,
    //     qty: x.qty,
    //     purchaseprice: x.purchasePrice,
    //     sellingprice: x.sellingPrice || 0,
    //     discpercent: x.discPercent,
    //     discnominal: x.discNominal,
    //     dpp: +(x.DPP || 0),
    //     ppn: +(x.PPN || 0),
    //     createdby: user,
    //     updatedby: user,
    //     createdat: current_time,
    //     updatedat: current_time,
    //     action_type: 'VOID'
    //   })
    // }
    await approvalPurchaseDetail.bulkCreate(recreateDetail, { transaction })
    return { success: true, message: 'Need to be approved', active: true, appvno: JSON.parse(JSON.stringify(headerCreated)).appvno }
  } catch (er) {
    return { success: false, message: er.message }
  }
}

export async function srvEditApprovalPurchase (current, data, detail, user) {
  const current_time = moment()
  const transaction = await customeSequelize.transaction()
  try {
    const headerPayload = {
      ...current,
      transno: current.transno,
      storeid: current.storeid,
      transdate: current.transdate,
      receivedate: data.receiveDate,
      supplierid: data.supplierCode,
      taxtype: data.taxType,
      taxpercent: data.taxPercent,
      reference: current.reference,
      memo: data.memo,
      invoicedate: moment(data.invoiceDate || current_time).format(formatDate),
      duedate: moment(data.dueDate || moment(current_time).add(1, 'day')).format(formatDate),
      invoicetype: data.invoiceType,
      taxid: data.taxId,
      discinvoicenominal: (data.discInvoiceNominal || 0),
      discinvoicepercent: (data.discInvoicePercent || 0),
      updatedby: user,
      updatedat: current_time,
      totalprice: data.invoiceTotal,
      totaldisc: (data.discTotal || 0),
      totaldpp: (data.totalDPP || 0),
      totalppn: (data.totalPPN || 0),
      totalnetto: (data.nettoTotal || 0),
      memo: data.memo || '',
      transtype: data.transType
    }
    await updateApprovalHeader({ appvid: data.appvid, appvpayload: headerPayload }, user, current_time, transaction)

    const newDetail = (detail || [])
    const afterUpdated = []
    const undeletedRecord = []
    for(let x in newDetail) {
      undeletedRecord.push(newDetail[x].productId)
      const tmpData = {
        qty: newDetail[x].qty,
        purchaseprice: +(newDetail[x].purchasePrice || 0),
        sellingprice: +(newDetail[x].sellingPrice || 0),
        discp1: +(newDetail[x].discp1 || 0),
        discp2: +(newDetail[x].discp2 || 0),
        discp3: +(newDetail[x].discp3 || 0),
        discp4: +(newDetail[x].discp4 || 0),
        discp5: +(newDetail[x].discp5 || 0),
        discnominal: +(newDetail[x].discNominal || 0),
        dpp: +(newDetail[x].DPP || 0),
        ppn: +(newDetail[x].PPN || 0),
        void: +(x.void || false),
        rounding_netto: (newDetail[x].rounding_netto || 0),
        rounding_ppn: (newDetail[x].rounding_ppn || 0),
        rounding_dpp: (newDetail[x].rounding_dpp || 0),
        updatedby: user,
        updatedat: current_time,
        action_type: 'ADD'
      }
      const tmpDataCreated = {
        appvid: data.appvid,
        storeid: current.storeid,
        transno: current.transno,
        productid: newDetail[x].productId,
        qty: newDetail[x].qty,
        purchaseprice: +(newDetail[x].purchasePrice || 0),
        sellingprice: +(newDetail[x].sellingPrice || 0),
        discp1: +(newDetail[x].discp1 || 0),
        discp2: +(newDetail[x].discp2 || 0),
        discp3: +(newDetail[x].discp3 || 0),
        discp4: +(newDetail[x].discp4 || 0),
        discp5: +(newDetail[x].discp5 || 0),
        discnominal: +(newDetail[x].discNominal || 0),
        dpp: +(newDetail[x].DPP || 0),
        ppn: +(newDetail[x].PPN || 0),
        void: +(newDetail[x].void || false),
        rounding_netto: (newDetail[x].rounding_netto || 0),
        rounding_ppn: (newDetail[x].rounding_ppn || 0),
        rounding_dpp: (newDetail[x].rounding_dpp || 0),
        createdby: user,
        createdat: current_time,
        action_type: 'ADD'
      }
      const retDetail = await approvalPurchaseDetail.update(tmpData, { where: { appvid: data.appvid, productid: newDetail[x].productId } }, { transaction })
      if(retDetail[0] === 0) {
        afterUpdated.push(tmpDataCreated)
      }
    }
    await approvalPurchaseDetail.bulkCreate(afterUpdated, { transaction })
    await approvalPurchaseDetail.destroy({ where: { appvid: data.appvid, productid: { [Op.notIn]: undeletedRecord } } }, { transaction })
    await transaction.commit()
    return { success: true }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}



export async function srvVoidSalesInvoice (data = {}, user, current_time, transaction) {
  try {
    const appvtype = 'VOID-FJ'
    if(+data.storeid === 0) throw new Error('Store cannot null or empty')
    else if(data.transno === null || data.transno === '' || typeof data.transno !== 'string') throw new Error('No. Trans cannot null or empty')

    const settAppv = await getSettingApprovalOf(+data.storeid, appvtype)
    if(!settAppv.status) {
      if(settAppv.code === 'ST02') return { success: true, active: false }
      else throw er.message
    }
    const invoicePayload = {
      storeid: +data.storeid,
      transno: data.transno
    }
    const headerCreated = await approval.create({
      appvtype: appvtype,
      appvgroupid: 'NOT-MULTIPLE-REQUEST',
      appvname: 'Void Sales Invoice',
      appvpayload: invoicePayload,
      storeid: +data.storeid,
      reqby: user,
      reqat: current_time,
      reqmemo: data.reqmemo,
      trigger_op: null
    }, { transaction, returning: ['*'] })

    return { success: true, message: 'Need to be approved', active: true, appvno: JSON.parse(JSON.stringify(headerCreated)).appvno }
  } catch (er) {
    return { success: false, message: er.message }
  }
}

export async function srvInsertApprovalReturIndent (data = {}, user, current_time, transaction) {
  try {
    const appvtype = 'INDENT'
    if(+data.storeid === 0) throw new Error('Store cannot null or empty')
    if(!data.transno) throw new Error('No. Indent cannot null or empty')

    const settAppv = await getSettingApprovalOf(+data.storeid, appvtype)
    if(!settAppv.status) {
      if(settAppv.code === 'ST02') return { success: true, active: false }
      else throw er.message
    }
    const payloadData = {
      storeid: +data.storeid,
      indentno: data.transno,
      description: data.description,
      dpretur: (data.dpretur || 0)
    }
    const approvalCreated = await approval.create({
      appvtype: appvtype,
      appvgroupid: 'NOT-MULTIPLE-REQUEST',
      appvname: 'Retur Indent',
      appvpayload: payloadData,
      storeid: +data.storeid,
      reqby: user,
      reqat: current_time,
      reqmemo: data.reqmemo,
      trigger_op: null
    }, { transaction, returning: ['*'], raw: true })

    let createdIndentDetail = []
    for (let x in data.details) {
      let items = data.details[x]
      createdIndentDetail.push({
        appvid: approvalCreated.appvid,
        referenceid: items.id,
        storeid: +data.storeid,
        transno: data.transno,
        productid: items.productid,
        returqty: items.history_returqty
      })
    }

    await approvalIndentDetail.bulkCreate(createdIndentDetail, { transaction })

    return { success: true, message: 'Need to be approved', active: true, appvno: approvalCreated.appvno }
  } catch (er) {
    return { success: false, message: er.message }
  }
}


export async function srvInsertApprovalMutasiOut (data = {}, user, current_time, transaction) {
  try {
    const appvtype = 'MUOUT'
    if(+data.storeId === 0) throw new Error('Store Sender cannot null or empty')
    if(+data.storeIdReceiver === 0) throw new Error('Store Receiver cannot null or empty')

    const settAppv = await getSettingApprovalOf(data.storeId, appvtype)
    if(!settAppv.status) {
      if(settAppv.code === 'ST02') return { success: true, active: false }
      else throw er.message
    }
    const payloadData = {
      storeid: data.storeId,
      storeidreceiver: data.storeIdReceiver,
      transdate: data.transDate,
      referencedate: data.referencedate,
      reference: data.reference,
      transtype: data.transType,
      employeeid: data.employeeId,
      carnumber: data.carNumber,
      status: 0,
      active: 1,
      totalpackage: data.totalPackage,
      description: data.description,
      createdby: user,
      createdat: current_time,
      requestno: data.requestno
    }
    const approvalCreated = await approval.create({
      appvtype: appvtype,
      appvgroupid: 'NOT-MULTIPLE-REQUEST',
      appvname: 'Mutation Out',
      appvpayload: payloadData,
      storeid: data.storeId,
      reqby: user,
      reqat: current_time,
      reqmemo: data.reqmemo,
      trigger_op: 'INSERT'
    }, { transaction, returning: ['*'], raw: true })

    let createdIndentMutasiOut = []
    for (let x in data.details) {
      let items = data.details[x]
      createdIndentMutasiOut.push({
        appvid: approvalCreated.appvid,
        storeid: data.storeId,
        transtype: items.transType,
        productid: items.productId,
        qty: items.qty,
        description: items.description
      })
    }
    await approvalTransferOutDetail.bulkCreate(createdIndentMutasiOut, { transaction })

    return { success: true, message: 'Need to be approved', active: true, appvno: approvalCreated.appvno }
  } catch (er) {
    return { success: false, message: er.message }
  }
}

// [NEW]: FERDINAN - 2025-04-08
export async function srvInsertApprovalCancelStockOut (data = {}, user, current_time, transaction) {
  try {
    const appvtype = 'STOCKOUT'
    const requestStockOut = await vwRequestStockOut.findOne({
      attributes: ['transactionnumber', 'storeid', 'id', 'queuenumber', 'statuscancel'],
      where: { transactionnumber: data.transactionnumber }, 
    }, { raw: true })

    if(+requestStockOut.storeid === 0) throw new Error('Store cannot null or empty')

    const settAppv = await getSettingApprovalOf(requestStockOut.storeid, appvtype)
    if(!settAppv.status) {
      if(settAppv.code === 'ST02') return { success: true, active: false }
      else throw er.message
    }

    const approvalCreated = await approval.create({
      appvtype: appvtype,
      appvgroupid: 'NOT-MULTIPLE-REQUEST',
      appvname: 'Approval for cancel stock out',
      appvpayload: requestStockOut,
      storeid: requestStockOut.storeid,
      reqby: user,
      reqat: current_time,
      reqmemo: data.memo,
      trigger_op: null
    }, { raw: true })

    return { success: true, message: 'Need to be approved', active: true, appvid: approvalCreated.appvid }
  } catch (er) {
    return { success: false, message: er.message }
  }
}

