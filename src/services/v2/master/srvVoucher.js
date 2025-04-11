import moment from 'moment'
import db from '../../../models/tableR'
import dbv from '../../../models/viewR'
import sequelize from '../../../native/sequelize'
import { setDefaultQuery } from '../../../utils/setQuery'
import { increaseSequence, getDataByStoreAndCode } from '../../sequencesService'
import { getSequenceFormatByCode } from '../../sequenceService'

const tblVCRegister = db.tbl_voucher_register
const tblVCRegisterProduct = db.tbl_voucher_register_product
const tblVCRegisterService = db.tbl_voucher_register_service
const vwVCRegister = dbv.vw_voucher_register
const vwVCRegisterProduct = dbv.vw_voucher_register_product
const vwVCRegisterService = dbv.vw_voucher_register_service


const attrRegister = [ 'id', 'storeid', 'storename', 'vouchercode','vouchername','serialcode','serialfromno','serialtono',
'seriallength','effectivedate','expireddate','vouchertype', 'vouchernominal', 'remarks',
'createdby','createdat','updatedby', 'updatedat', 'allowedit' ]

const attrRegisterProduct = [ 'id','vouchercode','vouchername', 'productid','productcode',
'productname','createdby','createdat','updatedby','updatedat', 'active' ]

const attrRegisterSevice = [ 'id','vouchercode','vouchername', 'serviceid','servicecode',
'servicename','createdby','createdat','updatedby','updatedat', 'active' ]

const tmpAttributes = (attr) => {
  let tmpAttr = [...attr]
  tmpAttr.splice(0, 1)
  return tmpAttr
}

/** ============================ GLOBAL FUNCTION ================================== **/

export function srvGetVoucherHeader (query) {
  const { m, ...other } = query
  let tmpAttrs = tmpAttributes(attrRegister)
  let queryDefault = setDefaultQuery(tmpAttrs, { ...other, browsedata: true }, true)
  return vwVCRegister.findAndCountAll({
    attributes: tmpAttrs,
    ...queryDefault,
    raw: true
  })
}

export function srvGetVoucherHeaderByCode (code, type = 'one') {
  const typeFetch = type === 'one' ? 'findOne' : 'findAll'
  const whereClause = type === 'one' ? { vouchercode: code } : { vouchercode: { $in: code } }
  return vwVCRegister[typeFetch]({
    attributes: attrRegister,
    where: whereClause,
    raw: true
  })
}

export function srvGetVoucherDetail (code) {
  return Promise.all([srvGetVoucherProduct(code), srvGetVoucherService(code)]).then(val => {
    return val
  }).catch(er => {
    return er
  })
}

export async function srvCreateVoucher (data, user, next) {
  const transaction = await sequelize.transaction()
  try {
    const { product = [], service = [], ...other } = data
    const extendInfo = { user, createdat: moment() }
    const vouchercode = await getSequenceFormatByCode({ seqCode: 'VOUCHER', type: -1 }, next)
    const createHeader = await srvCreateVoucherHeader({ ...other, vouchercode, ...extendInfo },transaction)
    const createDetailProduct = await srvCreateVoucherProduct(product, { ...extendInfo, vouchercode }, transaction)
    const createDetailService = await srvCreateVoucherService(service, { ...extendInfo, vouchercode }, transaction)
    const lastSequence = await getDataByStoreAndCode('VOUCHER', -1)
    await increaseSequence('VOUCHER', -1, lastSequence.seqValue, transaction)
    await transaction.commit()
    return { success: true, message: `Voucher ${vouchercode} has been created ...` }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}

export async function srvUpdateVoucher (data, user) {
  const transaction = await sequelize.transaction()
  try {
    const { product = [], service = [], ...other } = data
    const extendInfo = { user, updatedat: moment() }
    const updateHeader = await srvUpdateVoucherHeader({ ...other, ...extendInfo }, transaction)
    
    await transaction.commit()
    return { success: true, message: `Voucher ${updateHeader.vouchercode} has been updated ...` }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}

/** ============================ LOCAL FUNCTION ================================== **/

function srvGetVoucherProduct (code) {
  let tmpAttrs = tmpAttributes(attrRegisterProduct)
  return vwVCRegisterProduct.findAll({
    attributes: tmpAttrs,
    where: { vouchercode: code },
    raw: true
  })
}

function srvGetVoucherService (code) {
  let tmpAttrs = tmpAttributes(attrRegisterSevice)
  return vwVCRegisterService.findAll({
    attributes: tmpAttrs,
    where: { vouchercode: code },
    raw: true
  })
}

function srvCreateVoucherHeader (data, transaction) {
  return tblVCRegister.create({
    storeid: data.storeid,
    vouchercode: data.vouchercode,
    vouchername: data.vouchername,
    serialcode: data.serialcode,
    serialfromno: data.serialfromno,
    serialtono: data.serialtono,
    seriallength: data.seriallength,
    effectivedate: data.effectivedate,
    expireddate: data.expireddate,
    vouchertype: data.vouchertype,
    vouchernominal: data.vouchernominal,
    remarks: data.remarks,
    createdby: data.user,
    createdat: data.createdat
  }, { transaction })
}

function srvCreateVoucherProduct (data, info, transaction) {
  let newData = data.map(x => ({
      vouchercode: info.vouchercode,
      productid: x.productid,
      createdby: info.user,
      createdat: info.createdat
    }
  ))
  return tblVCRegisterProduct.bulkCreate(newData, { transaction })
}

function srvCreateVoucherService (data, info, transaction) {
  let newData = data.map(x => ({
      vouchercode: info.vouchercode,
      serviceid: x.id,
      createdby: info.user,
      createdat: info.createdat
    }
  ))
  return tblVCRegisterService.bulkCreate(newData, { transaction })
}

function srvUpdateVoucherHeader (data, transaction) {
  return tblVCRegister.update({
    vouchername: data.vouchername,
    serialcode: data.serialcode,
    serialfromno: data.serialfromno,
    serialtono: data.serialtono,
    seriallength: data.seriallength,
    effectivedate: data.effectivedate,
    expireddate: data.expireddate,
    vouchertype: data.vouchertype,
    vouchernominal: data.vouchernominal,
    remarks: data.remarks,
    updatedby: data.user,
    updatedat: data.updatedat
  }, { where: { id: data.headerid } }, { transaction })
}

// export function srvDeleteVoucherDetail (dataProduct, dataService, transaction) {
//   const deletedProduct = tblVCRegisterService.destroy()
// }