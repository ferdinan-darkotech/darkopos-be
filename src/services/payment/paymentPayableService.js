import db from '../../models'
import dbv from '../../models/view'
import stringSQL from '../../native/sqlPayment'
import sequelize from '../../native/sequelize'
import {
  ApiError
} from '../../services/v1/errorHandlingService'
import { Op } from 'sequelize'

const tbl_payment_ap = db.tbl_payment_ap
const vw_payment_ap_001 = dbv.vw_payment_ap_001
const vw_payment_ap_003 = dbv.vw_payment_ap_003
const vw_payment_ap_005 = dbv.vw_payment_ap_005
const vw_payment_ap_006 = dbv.vw_payment_ap_006

export function getTransByIdActive (id) {
  return tbl_payment_ap.findAll({
    where: {
      id: id,
      active: 1,
    },
    raw: false
  })
}

export function getTransById (id) {
  return getTransByIdActive(id).then(result => {
    if (result.length > 0) {
      return tbl_payment_ap.findOne({
        where: {
          id: id
        },
        raw: false
      })
    } else {
      return false
    }
  })
}

export function getTransBySplit (transNo, storeId) {
  if (transNo && storeId) {
    return vw_payment_ap_001.findAll({
      where: {
        transNo: transNo,
        storeId: storeId,
        active: 1,
      },
      raw: false
    })
  }
  return vw_payment_ap_001.findAll({
    where: {
      active: 1
    },
    raw: false
  })
}

export function getTransByNo (query) {
  if (query.from && query.to) {
    const { from, to, order, sort, ...other } = query
    let ordering = []
    if (order) order[0].split(';').map(e => ordering.push(e.split(',')))
    return vw_payment_ap_003.findAll({
      where: {
        transDate: {
          [Op.between]: [from, to]
        },
        ...other
      },
      order: order ? ordering : [],
      raw: false
    })
  }
  if (query.transNo && query.storeId) {
    return vw_payment_ap_003.findAll({
      where: {
        transNo: query.transNo,
        storeId: query.storeId,
      },
      raw: false
    })
  }
  return vw_payment_ap_003.findAll({
    raw: false
  })
}

export function getTransByNo5 (query) {
  if (query.from && query.to) {
    const { from, to, order, sort, ...other } = query
    let ordering = []
    if (order) order[0].split(';').map(e => ordering.push(e.split(',')))
    return vw_payment_ap_005.findAll({
      where: {
        invoiceDate: {
          [Op.and]: {
            [Op.gte]: from,
            [Op.lte]: to
          }
        },
        ...other
      },
      order: order ? ordering : [],
      raw: false
    })
  }
  if (query.transNo && query.storeId) {
    return vw_payment_ap_005.findAll({
      where: {
        transNo: query.transNo,
        storeId: query.storeId,
      },
      raw: false
    })
  }
  return vw_payment_ap_005.findAll({
    raw: false
  })
}

export function getTransByNo6 (query) {
  if (query.from && query.to) {
    const { from, to, ...other } = query
    return vw_payment_ap_006.findAll({
      where: {
        invoiceDate: {
          [Op.and]: {
            [Op.gte]: from,
            [Op.lte]: to
          }
        },
        ...other
      },
      raw: false
    })
  }
  if (query.transNo && query.storeId) {
    return vw_payment_ap_006.findAll({
      where: {
        transNo: query.transNo,
        storeId: query.storeId,
      },
      raw: false
    })
  }
  return vw_payment_ap_006.findAll({
    raw: false
  })
}

export function getPurchaseTransByNo (query) {
  let sSQL = stringSQL.s00002
  if (query.reference) {
    sSQL = sSQL.replace("_BIND01", `WHERE id = ${query.reference}`)
    sSQL = sSQL.replace("_WHERECONDITION", "")
    console.log('ssql', sSQL)
    return new Promise(function (resolve, reject) {
      sequelize.query(sSQL, {
        type: sequelize.QueryTypes.SELECT
      })
        .then(users => {
          resolve(users)
        })
    })
  }
  if (query.from && query.to) {
    sSQL = sSQL.replace("_BIND01", `WHERE invoiceDate BETWEEN '${query.from}' AND '${query.to}'`)
  } else {
    sSQL = sSQL.replace("_BIND01", "")
  }
  if (query.transNo && query.storeId && query.from && query.to) {
    sSQL = sSQL.replace("_WHERECONDITION",
      query.transNo ? `AND transNo='${query.transNo}' AND storeId='${query.storeId}'` : "")
  } else if (query.transNo && query.storeId && !(query.from && query.to)) {
    sSQL = sSQL.replace("_WHERECONDITION", query.transNo ? `WHERE transNo='${query.transNo}' AND storeId='${query.storeId}'` : "")
  } else if (!query.transNo && query.storeId && !(query.from && query.to)) {
    sSQL = sSQL.replace("_WHERECONDITION",
      query.storeId ? " storeId='" + query.storeId + "'" : "")
  } else if (!query.transNo && query.storeId && query.from && query.to) {
    sSQL = sSQL.replace("_WHERECONDITION",
      query.storeId ? " AND storeId='" + query.storeId + "'" : "")
  } else {
    sSQL = sSQL.replace("_WHERECONDITION", "")
  }
  console.log('ssql', sSQL)
  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, {
      type: sequelize.QueryTypes.SELECT
    })
      .then(users => {
        resolve(users)
      })
  })
}

export function PosTransExists (query) {
  return getPurchaseTransByNo(query).then(data => {
    if (data.length === 0) {
      return false;
    } else {
      return true;
    }
  })
}

export function ReceivableQuery (transNo, storeId) {
  const query = {
    transNo,
    storeId
  }
  return getTransByNo(query).then(result => {
    if (result.length > 0 && result[0].paid >= result[0].nettoTotal) {
      return false
    } else {
      return true
    }
  })
}

export function checkPayment (transNo, storeId, data) {
  const query = {
    transNo, storeId
  }
  return getTransByNo(query).then(result => {
    if (result.length > 0 && (result[0].paid + parseFloat(data.amount)) > result[0].nettoTotal) {
      return false
    } else {
      return true
    }
  })
}

export function createPayment (storeId, data, createdBy, next) {
  return tbl_payment_ap.create({
    reference: data.reference,
    storeId: storeId,
    storeIdPayment: data.storeIdPayment,
    bankAccountId: data.bankAccountId,
    typeCode: data.typeCode,
    amount: data.amount,
    description: data.description,
    cardName: data.cardName,
    cardNo: data.cardNo,
    checkNo: data.checkNo,
    transDate: data.transDate,
    printDate: data.printDate,
    createdBy: createdBy,
    updatedBy: null
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const {
      parent,
      original,
      sql,
      ...other
    } = errObj
    next(new ApiError(400, other, err))
  })
}

export function createBulkPayment (storeId, id, storeIdPayment, data, createdBy, next) {
  var arrayProd = []
  for (let key in data) {
    arrayProd.push({
      reference: id,
      storeId: storeId,
      storeIdPayment: storeIdPayment,
      bankAccountId: data[key].bankAccountId,
      typeCode: data[key].typeCode,
      amount: data[key].amount,
      description: data[key].description,
      cardName: data[key].cardName,
      cardNo: data[key].cardNo,
      checkNo: data[key].checkNo,
      transDate: data[key].transDate,
      printDate: data[key].printDate,
      createdBy: createdBy,
      updatedBy: null
    })
  }
  return tbl_payment_ap.bulkCreate(
    arrayProd
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function cancelPayment (id, memo, updatedBy, next) {
  return tbl_payment_ap.update({
    active: 0,
    memo: memo,
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