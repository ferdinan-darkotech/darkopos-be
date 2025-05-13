import moment from 'moment'
import db from '../models'
import dbv from '../models/view'
import stringSQL from '../native/transfer/sqlTransfer'
import { getNativeQuery } from '../native/nativeUtils'
import { getStockMinusAlert } from './Report/fifoReportService'
import { getSequenceFormatByCode } from './sequenceService'
import { getDataByStoreAndCode, increaseSequence } from './sequencesService'
import { rearrangeTransferOutHpokokHppPrice } from './transfer/transferOut'
import stringSQLsequence from '../native/sqlSequence'
import {
  ApiError
} from '../services/v1/errorHandlingService'
import sequelize from '../native/sequelize'
import { srvInsertApprovalMutasiOut } from './v2/monitoring/srvApproval'
import { Op } from 'sequelize'

const transferIn = db.tbl_transfer_in
const tbl_sequence = db.tbl_sequence
const transferInDetail = db.tbl_transfer_in_detail
const tbl_transfer_in_detail_hpokok = db.tbl_transfer_in_detail_hpokok
const transferOut = db.tbl_transfer_out
const transferOutDetail = db.tbl_transfer_out_detail
const tbl_transfer_out_detail_hpokok = db.tbl_transfer_out_detail_hpokok
const vwTransferIn = dbv.vw_transfer_in
const vwTransferOut = dbv.vw_transfer_out
const vwTransferOutDetail = dbv.vw_transfer_out_detail
const vwTransferInDetail = dbv.vw_transfer_in_detail

const vwTransferInFields = ['id', 'storeId', 'storeName', 'storeIdSender', 'storeNameSender', 'transNo', 'reference', 'referenceTrans', 'transType', 'employeeId', 'employeeName', 'carNumber',
  'status', 'active', 'transDate', 'totalPackage', 'description', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

const vwTransferOutFields = ['id', 'storeId', 'storeName', 'storeIdReceiver', 'storeNameReceiver', 'transNo', 'reference', 'referencedate',
  'transType', 'employeeId', 'employeeName', 'carNumber', 'status', 'active', 'transDate', 'totalPackage', 'description',
  'memo', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

const vwDetailFields = ['id', 'storeId', 'storeName', 'transNo', 'transType', 'transDate',
  'productId', 'productCode', 'productName', 'qty', 'description', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

// getDataIn,
export function getTransByNoIn (query) {
  return vwTransferIn.findOne({
    attributes: vwTransferInFields,
    where: {
      ...query
    },
    raw: false
  })
}

export function getTransByNoInForCancel (transNo, storeId) {
  console.log('getTransByNoIn:', transNo)
  return vwTransferIn.findOne({
    attributes: vwTransferInFields,
    where: {
      active: 1,
      transNo: transNo,
      storeId: storeId,
    },
    raw: false
  })
}

export function transExistsIn (params) {
  return getTransByNoIn(params).then(data => {
    if (data === null) {
      return false
    } else {
      return true
    }
  })
}

export function transExistsInForCancel (transNo, storeId) {
  return getTransByNoInForCancel(transNo, storeId).then(data => {
    if (data === null) {
      return false;
    } else {
      return true;
    }
  })
}

export function getInData (start, end, query) {
  if (start && end) {
    query["transDate"] = {
      [Op.between]: [start, end]
    }
  }
  return vwTransferIn.findAll({
    attributes: vwTransferInFields,
    order: [['transDate', 'ASC'], ['transNo', 'ASC']],
    where: {
      ...query,
    }
  })
}

// getDataOut,
export function getTransByNoOut (transNo, storeId) {
  console.log('getTransByNoOut:', transNo);
  return vwTransferOut.findOne({
    attributes: vwTransferOutFields,
    where: {
      active: 1,
      transNo: transNo,
      storeId: storeId,
    },
    raw: false
  })
}

export function getTransByNoOutReceiver (transNo, storeId) {
  console.log('getTransByNoOutReceiver:', transNo);
  return vwTransferOut.findOne({
    attributes: vwTransferOutFields,
    where: {
      active: 1,
      transNo: transNo,
      storeId: storeId,
    },
    raw: false
  })
}

export function getTransByNoOutForCancel (transNo, storeId) {
  console.log('getTransByNoOutForCancel:', storeId);
  return vwTransferOut.findOne({
    where: {
      status: 0,
      active: 1,
      transNo: transNo,
      storeId: storeId
    },
    raw: false
  })
}

export function getTransByNoOutForInsertIn (id) {
  console.log('getTransByNoOutForInsertIn:', id);
  return vwTransferOut.findOne({
    where: {
      active: 1,
      id: id
    },
    raw: false
  })
}

export function transExistsOut (transNo, storeId) {
  return getTransByNoOut(transNo, storeId).then(data => {
    if (data === null) {
      return false;
    } else {
      return true;
    }
  })
}

export function transExistsOutCancel (transNo, storeId) {
  return getTransByNoOutForCancel(transNo, storeId).then(data => {
    if (data === null) {
      return false;
    } else {
      return true;
    }
  })
}

export function transExistsOutStatus (id) {
  return getTransByNoOutForInsertIn(id).then(data => {
    if (data === null) {
      return false;
    } else {
      return true;
    }
  })
}

export function getOutData (start, end, query) {
  if (start && end) {
    query["transDate"] = {
      [Op.between]: [start, end]
    }
  }
  return vwTransferOut.findAll({
    attributes: vwTransferOutFields,
    order: [['transDate', 'ASC'], ['transNo', 'ASC']],
    where: {
      ...query,
    }
  })
}


export async function createTransferIn (transNo, data, detail, references, storeId, createdBy, next) {
  console.log('createTransferIn:', transNo);
  const transaction = await sequelize.transaction() 
  try {
    const sequence = await getSequenceFormatByCode({ seqCode: 'MI', type: storeId })
    if(!sequence) throw 'Cannot Find Sequence'
    const lastSequence = await getDataByStoreAndCode('MI', storeId)
    const refOut = JSON.parse(JSON.stringify(references))

    // update transfer out receive date
    await transferOut.update({
      receiveDate: data.receiveDate
    }, { where: { id: !data.reference ? null : data.reference } }, { transaction })

    await transferIn.create({
      storeId: storeId,
      storeIdSender: data.storeIdSender,
      transNo: sequence,
      reference: !data.reference ? null : data.reference,
      transType: data.transType,
      employeeId: data.employeeId,
      carNumber: data.carNumber,
      transDate: refOut.transDate,
      status: 1,
      active: 1,
      totalPackage: data.totalPackage,
      description: data.description,
      createdAt: moment(),
      createdBy: createdBy
    }, { transaction })

    var dataDetail = detail.map(x => ({
      storeId: storeId,
        transNo: sequence,
        transType: x.transType,
        productId: x.productId,
        qty: x.qty,
        description: x.description,
        updatestock: true,
        createdAt: moment(),
        createdBy: createdBy
    }))

    await transferInDetail.bulkCreate(dataDetail, { transaction })

    /** Update status pada mutasi out dilakukan didatabase menggunakan trigger */
    
    // await transferOut.update({
    //   receiveDate: data.receiveDate,
    //   status: 1,
    //   updatedBy: createdBy
    // }, {
    //     where: {
    //       id: data.reference
    //     }
    // }, { transaction })

    await increaseSequence('MI', storeId, lastSequence.seqValue, transaction)
    await transaction.commit()
    return { success: true, message: `Mutation ${sequence} has been created`, transNo: sequence }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
  
}

// export function createTransferInDetail (transNo, data, storeId, createdBy, next) {
//     var arrayProd = []
//     for (var n = 0; n < data.length; n += 1) {
//         arrayProd.push({
//             storeId: storeId,
//             transNo: transNo,
//             transType: data[n].transType,
//             productId: data[n].productId,
//             qty: data[n].qty,
//             description: data[n].description,
//             createdBy: createdBy,
//             updatedBy: '---'
//         })
//     }
//     return transferInDetail.bulkCreate(
//         arrayProd
//     ).catch(err => {
//         const errObj = JSON.parse(JSON.stringify(err))
//         const {
//             parent,
//             original,
//             sql,
//             ...other
//         } = errObj
//         next(new ApiError(400, other, err))
//     })
// }

export function updateTransferInCancel (data, updatedBy, next, transaction) {
  return transferIn.update({
    active: 0,
    status: 0,
    memo: data.memo,
    updatedBy: updatedBy
  }, {
      where: {
        id: data.id
      },
      transaction
    }).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const {
        parent,
        original,
        sql,
        ...other
      } = errObj
      next(new ApiError(501, other, err))
    })
}

export async function cancelTransferIn (data, updatedBy, next, res) {
  let transaction
  try {
    transaction = await sequelize.transaction()

    /*
    * Start Check Stock
    */

    const getCancelStock = await getInDetail({ transNo: data.transNo, storeId: data.storeId })
    let restrictedStock
    if ((getCancelStock || []).length > 0) {
      data.transDate = moment(getCancelStock[0].transDate).endOf('month').format('YYYY-MM-DD')
      restrictedStock = await getStockMinusAlert(data, getCancelStock, next) // jika true ada stok yg minus
      if (restrictedStock.status) {
        const jsonObj = {
          success: false,
          message: `${moment(data.transDate).format('YYYY-MM')}: Couldn't cancel transfer, stock is already used.`,
          detail: 'Use adjustment instead',
          data: restrictedStock.data
        }
        res.xstatus(422).json(jsonObj)
        await transaction.rollback()
        return false
      }

      data.transDate = moment().format('YYYY-MM-DD')
      restrictedStock = await getStockMinusAlert(data, getCancelStock, next) // jika true ada stok yg minus

      if (restrictedStock.status) {
        const jsonObj = {
          success: false,
          message: `${moment().format('YYYY-MM')}: Couldn't cancel transfer, stock is already used.`,
          detail: 'Use adjustment instead',
          data: restrictedStock.data
        }
        res.xstatus(422).json(jsonObj)
        await transaction.rollback()
        return false
      }
    }

    /*
    * End Check Stock
    */

    await updateTransferInCancel(data, updatedBy, next, transaction)
    await updateStatusTransferOutCancel(data.reference, 0, updatedBy, next, transaction)
    await transaction.commit()
    return true

  } catch (error) {
    await transaction.rollback()
    next(new ApiError(422, error + `Couldn't cancel mutasi.`, error))
  }
}

function insertTransferOutHeader (sequence, storeId, data, createdBy, transaction) {
  // INSERT HEADER
  return transferOut.create({
    storeId: storeId,
    storeIdReceiver: data.storeIdReceiver,
    transNo: sequence,
    transdate: moment(),
    referencedate: data.referencedate,
    reference: data.reference,
    transType: data.transType,
    employeeId: data.employeeId,
    carNumber: data.carNumber,
    status: 0,
    active: 1,
    totalPackage: data.totalPackage,
    description: data.description,
    createdBy: createdBy,
    createdAt: moment(),
    requestno: data.requestno
  }, { transaction })
}

function insertTransferOutDetail (sequence, storeId, detail, createdBy, transaction) {
  // INSERT DETAIL
  let arrayProd = []
  let productId = ''
  let n = 0
  if (detail.length > 0) {
    do {
      arrayProd.push({
        storeId: storeId,
        transNo: sequence,
        transType: detail[n].transType,
        productId: detail[n].productId,
        qty: detail[n].qty,
        description: detail[n].description,
        createdBy: createdBy,
        createdAt: moment(),
        updatestock: true,
      })
      productId += detail[n].productId + ','
      n += 1
    } while (n < detail.length)
  }
  transferOutDetail.bulkCreate(
    arrayProd,
    { transaction }
  )
  return ({
    productId,
    arrayProd
  })
}

export function getTransferOutHpokok (storeId, productId) {
  let sSQL = stringSQL.s00002
  return sequelize.query(sSQL, {
    replacements: {
      varStoreId: storeId,
      varProductId: productId
    },
  })
}

export async function getExistsTransferOutHpokok (period, year, storeId, productId) {
  let sSQL = stringSQL.s00004
    .replace("_BIND01", period)
    .replace("_BIND02", year)
    .replace("_BIND03", storeId)
    .replace("_BIND04", `'${productId}'`)
  const data = await getNativeQuery(sSQL, false, 'RAW')
  return data
}

export function simpleInsertTransferOutHpokok (rows, createdBy, transaction) {
  let arrayHppPrice = []
  for (let key in rows) {
    const data = rows[key]
    arrayHppPrice.push({
      storeId: data.storeId,
      storeIdReceiver: data.storeIdReceiver,
      purchaseId: data.transNoId,
      transNo: data.transNo,
      transType: data.transType,
      productId: data.productId,
      qty: data.qty,
      purchasePrice: data.purchasePrice,
      createdBy,
      updatedBy: '---'
    })
  }
  return tbl_transfer_out_detail_hpokok.bulkCreate(
    arrayHppPrice,
    { transaction }
  )
}

async function insertTransferOutHpokok (data, sequence, storeId, arrayProd, resultDetail, createdBy, transaction) {
  const arrayHppPrice = await rearrangeTransferOutHpokokHppPrice(data, sequence, storeId, arrayProd, resultDetail, createdBy)
  if (arrayHppPrice.success) {
    const insertedData = arrayHppPrice.data
    return tbl_transfer_out_detail_hpokok.bulkCreate(
      insertedData,
      { transaction }
    )
  }
  return arrayHppPrice.success
}

export async function createTransferOut (data, storeId, detail, createdBy, next, res) {
  let transaction

  try {
    transaction = await sequelize.transaction()
    const current_time = moment()
    const approvalPayload = {
      ...data,
      tg_op: 'INSERT',
      details: detail,
      storeId
    }
    let returnObj = {}
    const dataApproval = await srvInsertApprovalMutasiOut(approvalPayload, createdBy, current_time, transaction)
    if(!dataApproval.success) throw dataApproval.message
    if(dataApproval.success && !dataApproval.active) {
        // Prepare Data
        const sequence = await getSequenceFormatByCode({ seqCode: 'MO', type: storeId })
        if(!sequence) throw 'Cannot Find Sequence'
        const lastSequence = await getDataByStoreAndCode('MO', storeId)
        
        await insertTransferOutHeader(sequence, storeId, data, createdBy, transaction)
        await insertTransferOutDetail(sequence, storeId, detail, createdBy, transaction)
        await increaseSequence('MO', storeId, lastSequence.seqValue, transaction)
        returnObj = { sequence, success: true }
    } else {
        returnObj = { success: true, message: 'Transaction need to be approved ...', approval: true, appvno: dataApproval.appvno }
    }

    await transaction.commit()
    return returnObj
  } catch (error) {
    await transaction.rollback()
    next(new ApiError(422, error + `Couldn't cancel mutasi.`, error))
  }
}

export function updateStatusTransferOut (id, status, data, updatedBy, next) {
  console.log('updateStatusTransferOut', data)
  return transferOut.update({
    receiveDate: data.receiveDate,
    status: status,
    updatedBy: updatedBy
  }, {
      where: {
        id: id
      }
    }).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const {
        parent,
        original,
        sql,
        ...other
      } = errObj
      next(new ApiError(501, other, err))
    })
}

export function updateStatusTransferOutCancel (id, status, updatedBy, next, transaction) {
  return transferOut.update({
    status: status,
    updatedBy: updatedBy
  }, {
      where: {
        id: id
      },
      transaction
    }).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const {
        parent,
        original,
        sql,
        ...other
      } = errObj
      next(new ApiError(501, other, err))
    })
}

export function cancelTransferOut (data, updatedBy, next) {
  return transferOut.update({
    active: 0,
    memo: data.memo,
    updatedBy: updatedBy
  }, {
      where: {
        id: data.id
      }
    }).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const {
        parent,
        original,
        sql,
        ...other
      } = errObj
      next(new ApiError(501, other, err))
    })
}


/*======================DETAIL======================*/

export function getOutDetail (query) {
  return vwTransferOutDetail.findAll({
    attributes: vwDetailFields,
    where: {
      ...query,
    }
  })
}

export function getInDetail (query) {
  return vwTransferInDetail.findAll({
    attributes: vwDetailFields,
    where: {
      ...query,
    },
    raw: false
  })
}
