import moment from 'moment'
import db from '../../../models/tableR'
import dbv from '../../../models/viewR'
import sequelize from '../../../native/sequelize'
import { setDefaultQuery } from '../../../utils/setQuery'

const tblVCPackage = db.tbl_voucher_package
const tblVCPackageDetail = db.tbl_voucher_package_detail
const vwVCPackage = dbv.vw_voucher_package
const vwVCPackageDetail = dbv.vw_voucher_package_detail

const attrPackage = ['id','packagecode','packagename','packagedesc','packageprice','createdby','createdat',
'updatedby','updatedat', 'packageactive']

const attrPackageDetail = [ 'id', 'packagecode', 'packagename', 'packagedesc', 'voucherid','storeid',
'vouchercode','vouchername','vouchertype','vouchernominal','serialcode','seriallength','serialfromno',
'serialtono','qty','effectivedate','expireddate','createdby','createdat','updatedby','updatedat', 'active' ]

const tmpAttributes = (attr) => {
  let tmpAttr = [...attr]
  tmpAttr.splice(0, 1)
  return tmpAttr
}

/** ============================ GLOBAL FUNCTION ================================== **/

export function srvGetVoucherPackageHeader (query) {
  const { m, ...other } = query
  let tmpAttrs = tmpAttributes(attrPackage)
  let queryDefault = setDefaultQuery(tmpAttrs, other, true)
  return vwVCPackage.findAndCountAll({
    attributes: tmpAttrs,
    ...queryDefault,
    raw: true
  })
}

export function srvGetVoucherPackageHeaderByCode (code) {
  return tblVCPackage.findOne({
    attributes: attrPackage,
    where: { packagecode: code },
    raw: true
  })
}

export function srvGetVoucherPackageDetail (code, mode = 'mf') {
  let tmpAttrs = mode === 'mf' ? tmpAttributes(attrPackageDetail) : [ 'vouchercode', 'active', 'qty' ]
  return vwVCPackageDetail.findAll({
    attributes: tmpAttrs,
    where: { packagecode: code },
    raw: true
  })
}

export async function srvCreateVoucherPackage (data, user, next) {
  const transaction = await sequelize.transaction()
  try {
    const { detail = [], packagecode, ...other } = data
    const extendInfo = { user, times: moment(), packagecode }
    const createHeader = await srvCreateVoucherHeader(other, { ...extendInfo },transaction)
    const createDetail = await srvCreateVoucherDetail(detail, { ...extendInfo }, transaction)
    await transaction.commit()
    return { success: true, message: `Package ${packagecode} has been created ...` }
  } catch (er) {
    await transaction.rollback()
    if(er.name === 'SequelizeUniqueConstraintError') {
      er.message = 'Voucher code already exists'
    }
    return { success: false, message: er.message }
  }
}

export async function srvUpdateVoucherPackage (data, user) {
  const transaction = await sequelize.transaction()
  try {
    const { detail = [], ...other } = data
    const extendInfo = { user, times: moment() }
    const updateHeader = await srvUpdateVoucherHeader(other, { ...extendInfo }, transaction)
    const updateDetail = await srvUpdateVoucherDetail(detail, { ...extendInfo }, transaction)
    await transaction.commit()
    return { success: true, message: `Package ${packagecode} has been updated ...` }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}

/** ============================ LOCAL FUNCTION ================================== **/

function srvCreateVoucherHeader (data, info, transaction) {
  return tblVCPackage.create({
    packagecode: info.packagecode,
    packagename: data.packagename,
    packagedesc: data.packagedesc,
    packageprice: data.packageprice,
    createdby: info.user,
    createdat: info.times
  }, { transaction })
}

function srvCreateVoucherDetail (data, info, transaction) {
  let newData = data.map(x => ({
      packagecode: info.packagecode,
      voucherid: x.voucherid,
      qty: x.qty,
      createdby: info.user,
      createdat: info.times
    }
  ))
  return tblVCPackageDetail.bulkCreate(newData, { transaction })
}

function srvUpdateVoucherHeader (data, info, transaction) {
  return tblVCPackage.update({
    packagename: data.packagename,
    packagedesc: data.packagedesc,
    packageprice: data.packageprice,
    updatedby: info.user,
    updatedat: info.times,
  }, { where: { id: data.headerid } }, { transaction })
}

function srvUpdateVoucherDetail (data, info, transaction) {
  return tblVCPackage.update({
    qty: info.qty,
    active: data.active,
    updatedby: info.user,
    updatedat: info.times,
  }, { where: { id: data.detailid } }, { transaction })
}
