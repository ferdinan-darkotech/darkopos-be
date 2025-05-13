import db from '../../../models'
import dbr from '../../../models/tableR'
import dbv from '../../../models/view'
import dbvr from '../../../models/viewR' // [NEW]: FERDINAN - 2025-02-28
import { ApiError } from '../../../services/v1/errorHandlingService'
import sequelize from '../../../native/sequelize'
import stringSQL from '../../../native/sqlSequence'
import { increaseSequence, getDataByStoreAndCode } from '../../sequencesService'
import { getSequenceFormatByCode } from '../../sequenceService'
import { insertDataDetailBulk } from './woDetailService'
import moment from 'moment'

// [NEW]: FERDINAN - 2025-02-28
import { getSettingByCode } from '../../settingService'
import { srvGetAccessSPKFields } from '../../v2/setting/srvAccessGranted'
import { modifyDataChecksFieldsWO, modifyDataCustomeFieldsWO } from './woService'
import { Op } from 'sequelize'

let table = db.tbl_wo
let tableWoProduct = db.tbl_wo_product // [NEW]: FERDINAN - 2025-03-03
let table_check = db.tbl_wo_check
let table_detail = db.tbl_wo_detail
let relationField = dbr.tbl_relation_wo_field
let tbl_sequence = db.tbl_sequence

// [NEW]: FERDINAN - 2025-02-28
let vwPos = dbv.vw_pos
let vwQueueSales = dbvr.vw_queue_pos
const vwPosDetail = dbv.vw_pos_detail
const vwWo = dbvr.vw_wo

// relation field
function checkRelationFieldsByCondition (fieldId, otherWhere = {}) {
  return relationField.findAll({
    attributes: ['id', 'fieldid', 'relationfieldid', 'deletedat'],
    where: {
      fieldid: fieldId,
      ...otherWhere
    },
    raw: true
  })
}


export function srvGetAllRelationByField (fieldId) {
  return relationField.findAll({
    attributes: ['fieldid', 'relationfieldid'],
    where: {
      fieldid: fieldId,
      deletedAt: { [Op.eq]: null }
    },
    raw: true
  })
}

export async function srvModifyRelationField (fieldId, listRelationId = [], user, transaction) {
  const deletedRelation = await relationField.update({
    deletedBy: user,
    deletedAt: moment()
  }, { where: { fieldid: fieldId, relationfieldid: { [Op.notIn]: listRelationId } } }, { transaction })

  // const filterRelation = { deletedAt: { [Op.ne] null } }
  const findRelation = await checkRelationFieldsByCondition(fieldId)
  const listDeletedRelation = []
  let listNewRelation = listRelationId

  findRelation.map(x => {
    if(x.deletedat !== null && listRelationId.indexOf(x.relationfieldid) !== -1) {
      listDeletedRelation.push(x.id)
    }

    listNewRelation.splice(listNewRelation.indexOf(x.relationfieldid), 1)
  })

  if(listNewRelation.length > 0) {
    const newData = listNewRelation.map(x => ({ fieldid: fieldId, relationfieldid: x, createdBy: user, createdAt: moment() }))
    await relationField.bulkCreate(newData, { transaction })
  }


  if(listDeletedRelation.length > 0) {
    await relationField.update({
      deletedBy: null,
      deletedAt: null
    }, { where: { id: { [Op.in]: listDeletedRelation } } }, { transaction })
  }
}
//


// Local function
function createHeaderWO (header = {}, info, transaction) {
  return table.create({
    storeId: header.storeId,
    woNo: info.seq, //sequence[0].seq,
    vehicle_km: header.vehicle_km,
    gasoline_percent: header.gasoline_percent,
    timeIn: header.timeIn,
    memberId: header.memberId,
    policeNoId: header.policeNoId,
    takeAway: +header.takeAway,
    lastCaller: info.user,
    createdBy: info.user,
    createdAt: info.time,
    employeecode: header.employeecode || header.employeeCode || header.employee || header.employeeId || header.employeeid || null,
    noreference: header.noreference || '-',
    drivername: header.drivername || '-'
  }, { transaction })
}

function createWOCheck (check = [], info, transaction) {
  var arrayProd = []
  for (var n = 0; n < check.length; n++) {
    arrayProd.push({
      woId: info.woId,
      checkId: check[n].checkId,
      value: check[n].value,
      memo: check[n].memo,
      createdBy: info.user,
      createdAt: info.time
    })
  }
  return table_check.bulkCreate(
    arrayProd,
    { transaction }
  )
}

// [NEW]: FERDINAN - 2025-03-02
async function addManyWoProduct(data, transaction) {
  const formattedProduct = data.product.map(item => ({
    ...item,
    createdat: moment(),
    createdby: createdBy,
  }))

  await tableWoProduct.bulkCreate(formattedProduct, { transaction })
}

// Global function
export async function insertData (data, createdBy, next) {
  let transaction = null;
  try {
    // transaction = await sequelize.transaction()
    const sequence = await getSequenceFormatByCode({ seqCode: 'WO', type: data.header.storeId }, next)
    let info = { user: createdBy, time: moment(), seq: sequence }
    const header = await createHeaderWO(data.header, info, transaction)

    info.woId = header.id
    const check = await createWOCheck(data.check, info, transaction)
    const detail = await insertDataDetailBulk(data.custome, info, transaction)

    if(!sequence) throw 'Cannot Find Sequence'

    const lastSequence = await getDataByStoreAndCode('WO', data.header.storeId)
    await increaseSequence('WO', data.header.storeId, lastSequence.seqValue, transaction)
    
    // [NEW]: FERDINAN - 2025-03-02
    const product = data && data.product && data.product.length > 0 ? data.product.map((item) => ({ 
      woid: header.id, 
      createdat: moment(),
      createdby: createdBy, 
      ...item 
    })) : []

    // [NEW]: FERDINAN - 2025-03-02
    await tableWoProduct.bulkCreate(product, { transaction })

    return { success: true, message: `${sequence} has been created ..`, wono: sequence, woid: header.id }
  } catch (er) {
    return { success: false, message: er.message }
  }
}

export function insertFieldData (data, createdBy, next) {
  const { detail } = data
  var arrayProd = []
  for (var n = 0; n < (detail || []).length; n++) {
    arrayProd.push({
      woId: detail[n].woId,
      fieldId: detail[n].fieldId,
      value: detail[n].value,
      memo: detail[n].memo,
      createdBy: createdBy,
      updatedBy: '---'
    })
  }
  return table_detail.bulkCreate(
    arrayProd
  )
}

export function updateFieldData (data, updateBy, next) {
  const { detail } = data
  let arrayProd = []
  for (let n = 0; n < (detail || []).length; n++) {
    arrayProd.push({
      woId: detail[n].woId,
      fieldId: detail[n].fieldId,
      value: detail[n].value,
      memo: detail[n].memo,
      updatedBy: updateBy
    })
  }
  for (let n = 0; n < arrayProd.length; n++) {
    table_detail.update(
      arrayProd[n],
      {
        where: {
          id: detail[n].id
        }
      }
    ).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const { parent, original, sql, ...other } = errObj
      next(new ApiError(400, other, err))
    })
  }
  return table_detail.findAll({
    where: {
      woId: woId[0].woId,
    }
  })
}

// [NEW]: FERDINAN - 2025-02-28
export async function createWoProduct (data, createdBy, transaction, next) {
  try {
    if (data.product && data.product.length > 0) {
      await addManyWoProduct(data, transaction)
    }
    return { success: true, message: `WO Product has been created ..` }
  } catch (error) {
    return { success: false, message: error.message }
  }
}


export async function fetchWOProduct (main, pos) {
  const products = main && main.cashier_trans && main.cashier_trans.length > 0 ? main.cashier_trans : null
  const services = main && main.service_detail && main.service_detail.length > 0 ? main.service_detail : null

  const isOld = (!services || services.length === 0) && (!products || products.length === 0)
  // const isOld = true

  let cashierTrans;
  let serviceTrans;
  let bundle_promo = [];

  if (!pos) {
    const queuepos = await vwQueueSales.findOne({
      where: { woId: main.id }
    }, { raw: false })

    if (queuepos) {
      cashierTrans = queuepos.cashier_trans && queuepos.cashier_trans.length > 0 ? queuepos.cashier_trans.map((item) => ({
        woid: main.id,
        productid: item.productid || item.productId,
        code: item.productcode,
        name: item.productname,
        qty: item.qty,
        sellprice: item.sellprice,
        sellingprice: item.sellingPrice || item.price,
        price: item.price,
        disc1: item.disc1,
        disc2: item.disc2,
        disc3: item.disc3,
        discount: item.discount,
        totalprice: item.qty * item.sellprice,
        totalnetto: item.total,
        typecode: item.typecode
      })) : []
    
      serviceTrans = queuepos.service_detail && queuepos.service_detail.length > 0 ? queuepos.service_detail.map((item) => ({
        woid: main.id,
        productid: item.productid || item.productId,
        code: item.code,
        name: item.name,
        qty: item.qty,
        sellprice: item.sellPrice,
        sellingprice: item.sellPrice || item.price,
        disc1: item.disc1,
        disc2: item.disc2,
        disc3: item.disc3,
        discount: item.discount,
        totalprice: item.qty * item.sellPrice,
        totalnetto: item.total,
        typecode: item.typecode
      })) : []

      bundle_promo = queuepos.bundle_promo
    } else {
      cashierTrans = products
      serviceTrans = services
      bundle_promo = main.bundle_promo
    }
  } else {
    if (isOld) {
      const posDetail = await vwPosDetail.findAll({
        where: { transNo: pos.transno },
      })
  
      const posDetailServices = posDetail.filter(x => x.typeCode === 'S')
      const posDetailProducts = posDetail.filter(x => x.typeCode === 'P')
  
      cashierTrans = posDetailProducts && posDetailProducts.length > 0 ? posDetailProducts.map((item) => ({
        woid: main.id,
        productid: item.productid || item.productId,
        code: item.productcode || item.productCode,
        name: item.productname || item.productName,
        qty: item.qty,
        sellprice: item.sellprice || item.sellPrice,
        sellingprice: item.sellingprice || item.sellingPrice || item.price,
        price: item.price || item.sellingprice || item.sellingPrice,
        disc1: item.disc1,
        disc2: item.disc2,
        disc3: item.disc3,
        discount: item.discount,
        totalprice: item.qty * (item.sellprice || item.sellPrice),
        // totalnetto: item.total,
        typecode: item.typecode
      })) : []
  
      serviceTrans = posDetailServices && posDetailServices.length > 0 ? posDetailServices.map((item) => ({
        woid: main.id,
        productid: item.productid || item.productId,
        code: item.code || item.servicecode || item.serviceCode,
        name: item.name || item.servicename || item.serviceName,
        qty: item.qty,
        sellprice: item.sellprice || item.sellPrice,
        sellingprice: item.sellingprice || item.sellingPrice || item.price,
        price: item.price || item.sellingprice || item.sellingPrice,
        disc1: item.disc1,
        disc2: item.disc2,
        disc3: item.disc3,
        discount: item.discount,
        totalprice: item.qty * (item.sellprice || item.sellPrice),
        // totalnetto: item.total,
        typecode: item.typecode
      })) : []
    } else {
      cashierTrans = products
      serviceTrans = services
      bundle_promo = main.bundle_promo
    }
  }

  return {
    services: serviceTrans,
    products: cashierTrans,
    bundle_promo,
    isOld: isOld
  }
}

export async function fetchWOSPK(woid) {
  // [NEW]: FERDINAN - 2025-04-02
  const wo = await table.findOne({ where: { id: woid }, raw: true })
  if (!wo) throw 'WO Not Found'

  // [NEW]: FERDINAN - 2025-03-03
  const main = await vwWo.findOne({
    where: { id: woid },
    raw: true
  })

  const woCustome = await table_detail.findAll({
    attributes: ['memo', 'value', 'fieldid', 'condition', 'lastchecked', 'richvalues'],
    where: { woid: woid },
    raw: true
  })
  
  const settingVal = (((await getSettingByCode('CUSTOME')).dataValues || {}).settingValue || {})
  const listAccess = await srvGetAccessSPKFields({ m: 'bf' }, settingVal.WOFIELDS)
  
  const pos = await vwPos.findOne({
    where: { woid: parseInt(woid) },
    raw: true
  })

  // [NEW]: FERDINAN - 2025-03-03
  const { services, products, isOld } = await fetchWOProduct(main, pos)

  let finishedat;
  if (pos) finishedat = pos.createdat

  return {
    ...main,
    finishedat: finishedat || null,
    custome: woCustome,
    listaccess: listAccess,
    services,
    products,
    isOld
  }
}

// [NEW]: FERDINAN - 2025-03-03
export async function updateDataWoNotRegister (id, data, updateBy) {
  const { header, storeid, ...other } = data
  const transaction = await sequelize.transaction()
  const timeAt = moment()
  try {
    await table.update({
      takeAway: header.takeAway,
      updatedBy: updateBy,
      updatedAt: timeAt,
      vehicle_km: header.vehicle_km,
      gasoline_percent: header.gasoline_percent,
      takeAway: +header.takeAway,
      employeecode: header.employeecode || header.employeeCode || header.employee || header.employeeId || header.employeeid || null,
      noreference: header.noreference || '-',
      drivername: header.drivername || '-'
    }, { where: { id } }, transaction)
    
    const customeDetailModifier = await modifyDataCustomeFieldsWO(header.woid, other.custome, updateBy, transaction)
    const checksModifier = await modifyDataChecksFieldsWO(header.woid, other.check, updateBy, transaction)

    if (data && data.product && data.product.length > 0) {
      const isHasProduct = await tableWoProduct.findOne({ where: { woid: id } })
      const bodyRequest = data.product.map(item => ({
        ...item,
        woid: id,
        createdby: updateBy,
        createdat: moment(),
        updatedby: updateBy,
        updatedat: moment()
      }))
  
      if (isHasProduct) {
        await tableWoProduct.destroy({ where: { woId: id } })
        await tableWoProduct.bulkCreate(bodyRequest, { transaction })
      } else {
        await tableWoProduct.bulkCreate(bodyRequest, { transaction })
      }
    }
    await transaction.commit()
    return { message: 'WO has been updated', success: true, detail: customeDetailModifier[0][0].val, checks: checksModifier[0][0].val }
  } catch (er) {
    await transaction.rollback()
    return { message: er.message, success: false }
  }
}

export async function replaceWoProduct (id, data, updateBy) {
  try {
    const transaction = null

    if (data && data.product && data.product.length > 0) {
      const isHasProduct = await tableWoProduct.findOne({ where: { woid: id } })
      const bodyRequest = data.product.map(item => ({
        ...item,
        woid: id,
        createdby: updateBy,
        createdat: moment(),
        updatedby: updateBy,
        updatedat: moment()
      }))
  
      if (isHasProduct) {
        await tableWoProduct.destroy({ where: { woId: id } })
        await tableWoProduct.bulkCreate(bodyRequest, { transaction })
      } else {
        await tableWoProduct.bulkCreate(bodyRequest, { transaction })
      }
    }

    return { message: 'WO has been updated', success: true }
  } catch (er) {
    return { message: er.message, success: false }
  }
}

export async function updateEmployeeOnWO (id, user, data) {
  try {
    await table.update({ employeecode: data.employeecode, updatedBy: user }, { where: { id } })
    return { message: 'WO has been updated', success: true }
  } catch (er) {
    return { message: er.message, success: false }
  }
}